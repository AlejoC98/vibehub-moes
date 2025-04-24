'use client'
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { Box, Button, LinearProgress, Typography } from '@mui/material';
import { ShippingContent } from '@/utils/interfaces';
import { createClient } from '@/utils/supabase/client';
import { GlobalContext } from '@/utils/context/global_provider';

const CompleteOrderForm = ({ defaultData, setOpenModal }: { defaultData?: ShippingContent, setOpenModal?: (status: boolean) => void }) => {

    const supabase = createClient();
    const { userAccount } = useContext(GlobalContext);

    const [isShipping, setIsShipping] = useState<boolean>(false);
    const [allowComplete, setAllowComplete] = useState<boolean>(false);

    const handleCompleteOrder = async() => {
        try {
            const { error } = await supabase.from('shippings_orders').update({
                'closed_by': userAccount?.user_id,
                'closed_at': new Date(),
                'status': 'Shipped'
            }).eq('id', defaultData?.id);
            
            if (error) {
                throw new Error(error.message);
            }

            setOpenModal!(false);
            toast.success('Order Shipped!');
        } catch (error: any) {
            toast.warning(error.message);
        }
    }

    useEffect(() => {
        setAllowComplete(defaultData!.shippings_pick_list.length > 0);
    }, [defaultData])

    return (
        <Box padding={2}>
            {isShipping ? (
                <LinearProgress />
            ) : (<Box>
                {allowComplete ? (
                    <Box>
                        <Typography>Are you sure you want to mark this shipping order as complete? This action cannot be undone and all related data will be finalized.</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', placeItems: 'center', padding: '1rem 0' }}>
                            <Button className='btn-bittersweet' variant='contained' onClick={handleCompleteOrder}>Shipped</Button>
                            <Button sx={{ background: '#333' }} variant='contained' onClick={() => setOpenModal!(false)}>Cancel</Button>
                        </Box>
                    </Box>
                ) : (
                    <Typography>You need to add at least one pick list before completing the order. Please make sure everything is ready to go</Typography>
                )}
            </Box>)}
        </Box>
    )
}

export default CompleteOrderForm
