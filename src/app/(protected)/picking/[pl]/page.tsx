'use client'
import Block from '@/components/block';
import SubmitButton from '@/components/submit_button';
import { GlobalContext } from '@/utils/context/global_provider';
import { PickingInput, PickingTasksContent } from '@/utils/interfaces';
import { Avatar, Box, Button, IconButton, List, ListItem, ListItemAvatar, ListItemText, TextField, Typography } from '@mui/material';
import Grid from "@mui/material/Grid2";
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';
import ImageDropzone from '@/components/image_dropzone';
import { handleUploadToBucket, useFindUserByUUID } from '@/utils/functions/main';
import { useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Details from '@/components/details';
import CompleteQuicPick from '@/components/forms/picking/complete_quick_pick';
import { ImagePreviewDialog } from '@/components/image_preview_dialog';

const PickListDetails = () => {

    const params = useParams();
    const supabase = createClient();
    const findUserByUUID = useFindUserByUUID();
    const { setIsLaunching, userAccount } = useContext(GlobalContext);

    const [sku, setSku] = useState<string>('');
    const [quantity, setQuantity] = useState<number>(0);

    const [data, setData] = useState<PickingTasksContent>();
    const [isCompleted, setIsCompleted] = useState<boolean>(false);
    const [scannedProducts, setScannedProducts] = useState<PickingInput[]>([]);

    const [serailNumber, setSerialNumber] = useState<number>();
    const [productIMG, setProductIMG] = useState<File | null>(null);

    const skuExists = (sku: string): boolean => {
        return scannedProducts.some(item => item.product_sku.toLowerCase() === sku.toLowerCase());
    };

    const handleAddProduct = async () => {
        try {
            if (!sku || sku.trim() === '') {
                throw new Error('Please enter a valid SKU.');
            }

            if (!serailNumber || serailNumber.toString().length < 5) {
                throw new Error('Serial number must be at least 5 characters long.');
            }

            if (quantity == null || quantity <= 0) {
                throw new Error('Quantity must be greater than zero.');
            }

            if (!skuExists(sku)) {
                setScannedProducts(pre => [
                    ...pre,
                    {
                        product_sku: sku,
                        product_quantity: quantity,
                        img_url: productIMG != undefined ? URL.createObjectURL(productIMG!) : undefined,
                        img_file: productIMG || undefined,
                        serial_number: serailNumber,
                        picked_by: userAccount?.user_id!,
                    }
                ]);

                setSku('');
                setQuantity(0);
                setProductIMG(null);
                setSerialNumber(undefined);

                toast.success('Product Loaded');
            } else {
                throw new Error('Product sku already scanned!.');
            }


        } catch (error: any) {
            toast.warning(error.message || 'Something went wrong.');
        }
    }

    useEffect(() => {
        const createQuickPicking = async () => {
            const { data, error } = await supabase.from('pickings').upsert({
                pick_number: params.pl as string,
            }, { onConflict: 'pick_number' }).select('*, pickings_products(*)').single();

            if (error) {
                console.log(error.message);
            }
            
            setData(data);
            setIsCompleted(data.status == 'Completed');
            setScannedProducts(data.pickings_products);
        }

        createQuickPicking();
        setIsLaunching(false);
    }, [params]);

    const actionButtons = userAccount?.accounts_roles?.some(role => [1, 2, 3].includes(role.role_id)) && !isCompleted
        ? [
            {
                text: 'Complete',
                color: '#64B6AC',
                form: <CompleteQuicPick title={'Complete Quick Order'} />,
                data: { products: scannedProducts, id: data?.pick_number }
            }
        ]
        : [];

    return (
        <Box>
            <Details title={'Quick Pick Order'} actionButtons={actionButtons}>
                <Grid size={12}>
                </Grid>
                <Grid size={{ xl: isCompleted ? 2 : 8, lg: isCompleted ? 2 : 8, md: isCompleted ? 6 :12, sm: 12, xs: 12 }}>
                    <Block sx={{ padding: 5, display: 'grid', gap: 2}}>
                        <Typography variant='h5' fontWeight='bold'>Scan Products</Typography>
                        <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', placeItems: 'center'}}>
                            { isCompleted ? (
                                <Grid container spacing={1}>
                                    <Grid size={12}>
                                        <Typography variant='h6' fontWeight='bold'>Pick #</Typography>
                                        <Typography>{ data?.pick_number }</Typography>
                                    </Grid>
                                    <Grid size={12}>
                                        <Typography variant='h6' fontWeight='bold'>Created By</Typography>
                                        <Typography>{ findUserByUUID(data?.created_by!) }</Typography>
                                    </Grid>
                                    <Grid size={12}>
                                        <Typography variant='h6' fontWeight='bold'>Verified By</Typography>
                                        <Typography>{ findUserByUUID(data?.verified_by!) }</Typography>
                                    </Grid>
                                    <Grid size={12}>
                                        <Typography variant='h6' fontWeight='bold'>Status</Typography>
                                        <Typography>{ data?.status }</Typography>
                                    </Grid>
                                    <Grid size={12}>
                                        <Box sx={{ display: 'grid', placeItems: 'center'}}>
                                            <ImagePreviewDialog imageUrl={data?.img_url!} />
                                        </Box>
                                    </Grid>
                                </Grid>
                            ) : (
                                <Grid container spacing={2}>
                                <Grid size={12}>
                                    <Typography variant='h6'>Details</Typography>
                                </Grid>
                                <Grid size={{ xl: isCompleted ? 12 : 8, lg: isCompleted ? 12 : 8, md: 12, sm: 12, xs: 12 }}>
                                    <Grid container spacing={2}>
                                        <Grid size={12}>
                                            <TextField
                                                fullWidth
                                                disabled={isCompleted}
                                                value={sku || ''}
                                                onChange={(e) => setSku(e.target.value)}
                                                label='Product Sku'
                                                slotProps={{
                                                    input: {
                                                        endAdornment: <IconButton onClick={() => setSku('')}>
                                                            <CloseIcon />
                                                        </IconButton>,
                                                    },
                                                }}
                                            />
                                        </Grid>
                                        <Grid size={12}>
                                            <TextField
                                                fullWidth
                                                disabled={isCompleted}
                                                value={serailNumber || ''}
                                                onChange={(e) => setSerialNumber(parseInt(e.target.value))}
                                                label='Serial Number'
                                                slotProps={{
                                                    input: {
                                                        endAdornment: <IconButton onClick={() => setSerialNumber(undefined)}>
                                                            <CloseIcon />
                                                        </IconButton>,
                                                    },
                                                }}
                                            />
                                        </Grid>
                                        <Grid size={12}>
                                            <TextField
                                                fullWidth
                                                disabled={isCompleted}
                                                value={quantity || ''}
                                                onChange={(e) => setQuantity(parseInt(e.target.value))}
                                                label='Product Quantity'
                                                slotProps={{
                                                    input: {
                                                        endAdornment: <IconButton onClick={() => setQuantity(0)}>
                                                            <CloseIcon />
                                                        </IconButton>,
                                                    },
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                { !isCompleted && (
                                    <Grid size={{ xl: 4, lg: 4, md: 12, sm: 12, xs: 12 }}>
                                        <Box sx={{ display: 'grid', placeItems: 'center', height: '100%' }}>
                                            <ImageDropzone productIMG={productIMG} setProductIMG={setProductIMG} maxWidth={150} />
                                        </Box>
                                    </Grid>
                                )}
                                <Grid size={12}>
                                    <SubmitButton
                                        fullWidth
                                        disabled={isCompleted}
                                        btnText={'Load'}
                                        className='btn-munsell'
                                        onClick={handleAddProduct}
                                    />
                                </Grid>
                            </Grid>
                            )}
                        </Box>
                    </Block>
                </Grid>
                <Grid size={{ xl: isCompleted ? 10 : 4, lg: isCompleted ? 10 : 4, md: isCompleted ? 6 : 12, sm: 12, xs: 12 }}>
                    <Block sx={{ padding: 5 }}>
                        <Typography variant='h5' fontWeight='bold'>Scanned Products</Typography>
                        <List>
                            {scannedProducts.map((item, index) => (
                                <ListItem key={index}>
                                    <ListItemAvatar>
                                        <Avatar src={item.img_url || '/static/img/default_product.jpg'} />
                                    </ListItemAvatar>
                                    <ListItemText primary={`SKU: ${item.product_sku}`} secondary={`Quantity:${item.product_quantity} - Serial: ${item.serial_number}`} />
                                </ListItem>
                            ))}
                        </List>
                    </Block>
                </Grid>
            </Details>
        </Box>
    )
}

export default PickListDetails
