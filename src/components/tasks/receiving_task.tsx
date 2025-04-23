'use client'
import { Box, Button, List, ListItem, ListItemIcon, ListItemText, Step, StepLabel, Stepper, TextField, Typography } from '@mui/material'
import React, { ReactElement, useContext, useState } from 'react'
import Grid from '@mui/material/Grid2';
import { NumberField } from '@/style/global';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { ReceivingProductsInput, ReceivingContent } from '@/utils/interfaces';
import { createClient } from '@/utils/supabase/client';
import CheckIcon from '@mui/icons-material/Check';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { GlobalContext } from '@/utils/context/global_provider';
import { convertTimeByTimeZone } from '@/utils/functions/main';
import Block from '@/components/block';

const steps = [
    'Verify Information',
    'Scan Products',
    'Complete Receiving',
];

const ReceivingTask = ({ data, updateData } : { data: ReceivingContent, updateData: (data: ReceivingContent) => void}) => {

    const router = useRouter();
    const supabase = createClient();
    const { userAccount } = useContext(GlobalContext);

    const [poNumber, setPoNumber] = useState<string>();
    const [activeStep, setActiveStep] = useState<number>(0);
    const [trailerNumber, setTrailerNumber] = useState<string>();
    const [isCompleted, setIsCompleted] = useState<boolean>(false);
    const [receProducts, setReceProducts] = useState<ReceivingProductsInput[]>([]);

    const {
        reset,
        register,
        handleSubmit,
    } = useForm<ReceivingProductsInput>({
        defaultValues: {
            'damaged_quantity': 0
        }
    });

    const handleValidateProduct: SubmitHandler<ReceivingProductsInput> = async (formData) => {
        try {
            const product = data.receiving_products?.find(rp => rp.products.sku == formData['sku'])
            if (product == null) {
                throw new Error('Product doesn\'t match');
            }

            if (product.expected_quantity != formData['received_quantity']) {
                const result = await Swal.fire({
                    title: "Looks like the quantity doesn't match",
                    text: "Do you want to report you received less that what expected",
                    icon: "question",
                    showCancelButton: true,
                    confirmButtonText: 'Report'
                });

                if (result.isConfirmed) {
                    await Swal.fire("Perfect!", "We will send the report", "success");
                } else {
                    return;
                }
            }

            setReceProducts((prev) => [...prev, { ...formData, 'product_id': product.products.id }]);
            reset();
        } catch (error: any) {
            toast.warning(error.message);
        }
    }

    const validateInformation = () => {
        try {
            if (data.po_number != poNumber) {
                throw new Error('PO Number doesn\'t match!');
            }
            if (data.trailer_number != trailerNumber) {
                throw new Error('Trailer doesn\'t match!');
            }

            setActiveStep(activeStep + 1);
        } catch (error: any) {
            toast.warning(error.message);
        }
    }

    const validateReceivedProducts = async () => {
        try {

            if (receProducts.length != receProducts.length) {
                throw new Error('Yuo have to scan all the products');
            }

            for (var pro of receProducts) {
                const { error } = await supabase.from('receiving_products').update({ 'damaged_quantity': pro.damaged_quantity, 'received_quantity': pro.received_quantity }).eq('receiving_id', data.id!).eq('product_id', pro.product_id);

                await supabase.from('racks_locations_products').insert({
                    'rack_location_id': 1,
                    'product_id': pro.product_id,
                    'quantity': pro.received_quantity,
                    'created_by': userAccount?.user_id,
                    'created_at': convertTimeByTimeZone(userAccount?.sessionTimeZone!)
                });

                if (error) {
                    throw new Error(error.message);
                }
            }

            setActiveStep(activeStep + 1);
        } catch (error: any) {
            toast.warning(error.message);
        }
    }

    const updateReceivingStatus = async () => {
        try {
            const { error } = await supabase.from('receiving').update({
                'status': 'Put Away'
            }).eq('id', data.id);

            if (error) {
                throw new Error(error.message);
            }

            toast.success('Receiving Completed!');
            setIsCompleted(true);
            updateData({...data, 'status': 'Put Away'});
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    const stepValidations: Array<() => void> = [
        validateInformation, validateReceivedProducts, updateReceivingStatus
    ];

    const stepContent: Array<ReactElement> = [
        <Grid container spacing={2}>
            <Grid size={6}>
                <NumberField
                    required
                    fullWidth
                    type='number'
                    defaultValue={poNumber}
                    label='PO Number'
                    onChange={(event) => setPoNumber(event.target.value)}
                />
            </Grid>
            <Grid size={6}>
                <TextField
                    fullWidth
                    required
                    defaultValue={trailerNumber}
                    label="Trailer Number"
                    onChange={(event) => setTrailerNumber(event.target.value)}
                />
            </Grid>
        </Grid>,
        <Grid container spacing={2}>
            <Grid size={6}>
                <List>
                    {data.receiving_products?.map((item) => (
                            <ListItem key={item.products.id} sx={{ background: receProducts?.some(product => product.sku === item.products.sku!) ? '#F4F4F4' : 'transparent' }}>
                                <ListItemText primary={item.products.name} secondary={`Expecting ${item.expected_quantity}`} />
                                {receProducts?.some(product => product.sku === item.products.sku!) && (
                                    <ListItemIcon>
                                        <CheckIcon color='success' />
                                    </ListItemIcon>
                                )}
                            </ListItem>
                        ))}
                </List>
            </Grid>
            <Grid size={6}>
                <form onSubmit={handleSubmit(handleValidateProduct)}>
                    <Grid container spacing={2}>
                        <Grid size={12}>
                            <TextField
                                fullWidth
                                autoFocus
                                label='Product Sku'
                                {...register('sku')}
                            />
                        </Grid>
                        <Grid size={12}>
                            <NumberField
                                fullWidth
                                type='number'
                                label='Quantity'
                                helperText='Total received even damage'
                                {...register('received_quantity')}
                            />
                        </Grid>
                        <Grid size={12}>
                            <TextField
                                fullWidth
                                label='Any Damaged?'
                                helperText='Put just the ammount of damaged products'
                                {...register('damaged_quantity')}
                            />
                        </Grid>
                        {receProducts.length < data.receiving_products!.length && (
                                <Grid size={12}>
                                    <Box sx={{ display: 'grid', placeItems: 'center' }}>
                                        <Button fullWidth variant='contained' type='submit'>Confirm</Button>
                                    </Box>
                                </Grid>
                            )}
                    </Grid>
                </form>
            </Grid>
        </Grid>,
        <Grid container spacing={2}>
            <Grid size={6}>
                <Typography>PO# {poNumber}</Typography>
            </Grid>
            <Grid size={6}>
                <Typography>Trailer #{trailerNumber}</Typography>
            </Grid>
            <Grid size={12}>
                <List>
                    {receProducts?.map((pro) => (
                            <ListItem key={pro.sku} sx={{ background: '#F4F4F4' }}>
                                <ListItemText primary={pro.name} secondary={`Expecting ${pro.received_quantity} - Received ${pro.received_quantity} - Damaged ${pro.damaged_quantity} `} />
                            </ListItem>
                        ))}
                </List>
            </Grid>
        </Grid>,
    ];

    return (
        <Box>
            <Grid container spacing={2}>
                <Grid size={12}>
                    <Block>
                        <Stepper activeStep={activeStep} alternativeLabel>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                        <Box sx={{ maxWidth: 600, margin: '5rem auto' }}>
                            {stepContent[activeStep]}
                        </Box>
                        { !isCompleted ? (
                            <Box sx={{ display: 'flex', justifyContent: activeStep > 0 ? 'space-between' : 'center', width: 400, margin: '10px auto' }}>
                            {activeStep > 0 && (
                                <Button variant='contained' onClick={() => setActiveStep(activeStep - 1)}>Back</Button>
                            )}
                            <Button variant='contained' onClick={stepValidations[activeStep]}>{(activeStep + 1) == steps.length ? 'Complete' : 'Next'}</Button>
                        </Box>
                        ) : (
                            <Box sx={{ display: 'flex', justifyContent: activeStep > 0 ? 'space-between' : 'center', width: 400, margin: '10px auto' }}>
                            <Button variant='contained' onClick={() => router.back()}>Close</Button>
                        </Box>
                        )}
                    </Block>
                </Grid>
            </Grid>
        </Box>
    )
}

export default ReceivingTask