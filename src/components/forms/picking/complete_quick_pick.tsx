'use client'
import ImageDropzone from '@/components/image_dropzone'
import { GlobalContext } from '@/utils/context/global_provider';
import { handleUploadToBucket } from '@/utils/functions/main';
import { PickingInput, PickingTasksContent } from '@/utils/interfaces';
import { createClient } from '@/utils/supabase/client';
import { Box, Button, LinearProgress, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify';

interface QuickPickComplete extends PickingTasksContent {
    products: PickingInput[];
}

const CompleteQuicPick = ({ defaultData, setOpenModal, title }: { defaultData?: QuickPickComplete, setOpenModal?: (status: boolean) => void, title: string}) => {

    const supabase = createClient();
        const { userAccount } = useContext(GlobalContext);
    
        const [isShipping, setIsShipping] = useState<boolean>(false);
        const [allowComplete, setAllowComplete] = useState<boolean>(false);
        const [loadedOrderIMG, setLoadedOrderIMG] = useState<File | null>(null);
    
            const completePick = async () => {
                try {
                    setIsShipping(true);
                    for (var product of defaultData?.products!) {
                        var productURL: { signedUrl: any; } | null = null;
                        var now = new Date().toLocaleString();
        
                        if (product.img_file != null) {
                            productURL = await handleUploadToBucket(
                                'pickings',
                                `${defaultData?.pick_number!}/${product.product_sku + now}`,
                                product.img_file!
                            );
                        }

                        const { error } = await supabase.from('pickings_products').insert({
                            product_sku: product.product_sku,
                            product_quantity: product.product_quantity,
                            is_ready: true,
                            img_url: productURL != null ? productURL?.signedUrl : null,
                            picked_by: userAccount?.user_id,
                            serial_number: product.serial_number,
                            picking_id: defaultData?.id,
                        });
        
                        if (error) {
                            throw new Error(error.message);
                        }
                    }

                    const completeURL = await handleUploadToBucket(
                        'pickings',
                        `${defaultData?.pick_number!}/complete-${defaultData?.pick_number!}`,
                        loadedOrderIMG!
                    );

                    const { error } = await supabase.from('pickings').update(
                        {status: 'Completed', img_url: completeURL.signedUrl}).eq('id', defaultData?.id);

                    if (error) {
                        throw new Error(error.message);
                    }
        
                    setOpenModal!(false);
                    toast.success('Quick Pick Completed!');
                } catch (error: any) {
                    toast.warning(error.message);
                }
                setIsShipping(false);
            }
    
        useEffect(() => {
            setAllowComplete(defaultData!.products.length > 0);
        }, [defaultData])

  return (
    <Box padding={2}>
        <Typography variant='h5' fontWeight='bold' >{ title }</Typography>
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
                            <Button className='btn-bittersweet' variant='contained' onClick={completePick} disabled={loadedOrderIMG == null}>Shipped</Button>
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

export default CompleteQuicPick
