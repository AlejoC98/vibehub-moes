'use client'
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { Box, Button, LinearProgress, Typography } from '@mui/material';
import { ShippingContent } from '@/utils/interfaces';
import { createClient } from '@/utils/supabase/client';
import { GlobalContext } from '@/utils/context/global_provider';
import ImageDropzone from '@/components/image_dropzone';
import { handleUploadToBucket } from '@/utils/functions/main';

const CompleteOrderForm = ({ defaultData, setOpenModal }: { defaultData?: ShippingContent, setOpenModal?: (status: boolean) => void }) => {

    const supabase = createClient();
    const { userAccount } = useContext(GlobalContext);

    const [isShipping, setIsShipping] = useState<boolean>(false);
    const [allowComplete, setAllowComplete] = useState<boolean>(false);
    const [loadedOrderIMG, setLoadedOrderIMG] = useState<File | null>(null);

    const handleCompleteOrder = async() => {
        try {
            setIsShipping(true);

            const productURL = await handleUploadToBucket(
                'shippingorders',
                `${defaultData?.id}/${defaultData?.trailer_number}`,
                loadedOrderIMG!
            );

            const { error } = await supabase.from('shippings_orders').update({
                'closed_by': userAccount?.user_id,
                'closed_at': new Date(),
                'status': 'Shipped',
                'img_url': productURL!.signedUrl,
            }).eq('id', defaultData?.id);
            
            if (error) {
                throw new Error(error.message);
            }

            setOpenModal!(false);
            toast.success('Order Shipped!');
        } catch (error: any) {
            console.log(error.message);
            toast.warning("Error shipping order.");
        }
        setIsShipping(false);
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
                        <br/>
                        <Typography fontWeight='bold'>Please upload a picture of the loaded truck</Typography>
                        <ImageDropzone productIMG={loadedOrderIMG} setProductIMG={setLoadedOrderIMG} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', placeItems: 'center', padding: '1rem 0' }}>
                            <Button className='btn-bittersweet' variant='contained' onClick={handleCompleteOrder} disabled={loadedOrderIMG == null}>Shipped</Button>
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
