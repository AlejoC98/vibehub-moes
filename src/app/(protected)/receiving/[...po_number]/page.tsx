'use client'
import { Box, Button, IconButton, InputAdornment, List, ListItem, ListItemIcon, ListItemText, Step, StepLabel, Stepper, TextField, Typography } from '@mui/material'
import React, { ReactElement, useContext, useEffect, useState } from 'react'
import Grid from '@mui/material/Grid2';
import { Block, NumberField } from '../../../../../style/global';
import { useParams } from 'next/navigation';
import { ProductContent, RackContent, RackLocationContent, ReceivingContent } from '../../../../../utils/interfaces';
import { toast } from 'react-toastify';
import { GlobalContext } from '../../../../../utils/context/global_provider';
import { createClient } from '../../../../../utils/supabase/client';
import CheckIcon from '@mui/icons-material/Check';
import { SubmitHandler, useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import SearchIcon from '@mui/icons-material/Search';

const steps = [
    'Verify Information',
    'Scan Products',
    'Complete Receiving',
];

export interface ReceiveProductsInput {
    product_id?: number;
    id?: number;
    sku: string;
    name?: string;
    received_quantity: number;
    damaged_quantity: number;
}

const ReceivingDetails = () => {

    const params = useParams();
    const supabase = createClient();
    const { receivings, racks, products } = useContext(GlobalContext);
    const [activeStep, setActiveStep] = useState<number>(0);
    const [receivingData, setReceivingData] = useState<ReceivingContent>();
    // const [products, setProducts] = useState<ProductContent[]>([]);
    const [poNumber, setPoNumber] = useState<string>();
    const [trailerNumber, setTrailerNumber] = useState<string>();
    const [receProducts, setReceProducts] = useState<ReceiveProductsInput[]>([]);
    const [findSku, setFindSku] = useState<string>();
    const [putAwayProduct, setPutAwayProduct] = useState<ReceiveProductsInput>();
    const [findLocation, setFindLocation] = useState<string>();
    const [putAwayRack, setPutAwayRack] = useState<RackLocationContent>();

    const {
        register,
        reset,
        handleSubmit,
    } = useForm<ReceiveProductsInput>({
        defaultValues: {
            'damaged_quantity': 0
        }
    });

    const getRecivingData = async (po_number: string) => {
        try {
            var receiProd = [];
            const findRe = receivings?.find(re => re.po_number == po_number);

            if (findRe != null) {
                for (var rp of findRe.receiving_products!) {
                    const filteredProducts = products?.find(pr => pr.id == rp.product_id);

                    if (filteredProducts == null) {
                        throw new Error("Error finding products");
                    }

                    const { data, error } = await supabase.from('racks_locations_products').select().eq('rack_location_id', 1).eq('product_id', filteredProducts.id).maybeSingle();

                    if (data != null) {
                        receiProd.push({
                            id: filteredProducts.id,
                            product_id: filteredProducts.id,
                            sku: filteredProducts.sku!,
                            name: filteredProducts.name,
                            received_quantity: rp.received_quantity,
                            damaged_quantity: rp.damage_quantity
                        });
                    }


                    // receiProd.push(
                    //     {
                    //         ...filteredProducts,
                    //         'quantity': rp.expected_quantity,
                    //         'received_quantity': rp.received_quantity,
                    //         'damaged_quantity': rp.damage_quantity
                    //     }
                    // );
                }
                setReceProducts(receiProd);
                setReceivingData(findRe);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    const handleValidateProduct: SubmitHandler<ReceiveProductsInput> = async (formData) => {
        try {
            const product = receProducts.find(p => p.sku == formData['sku'])
            if (product == null) {
                throw new Error('Product doesn\'t match');
            }

            if (product.received_quantity != formData['received_quantity']) {
                const result = await Swal.fire({
                    title: "Looks like the quantity doesn't match",
                    text: "Do you want to report you received less that what expected",
                    icon: "question",
                    showCancelButton: true,
                    confirmButtonText: 'Report'
                })

                if (result.isConfirmed) {
                    await Swal.fire("Perfect!", "We will send the report", "success");
                } else {
                    return;
                }
            }

            setReceProducts((prev) => [...prev, { ...formData, 'product_id': product.id }]);
            reset();
        } catch (error: any) {
            toast.warning(error.message);
        }

    }

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
                    {receProducts?.map((pro) => (
                        <ListItem key={pro.id} sx={{ background: receProducts?.some(product => product.sku === pro.sku!) ? '#F4F4F4' : 'transparent' }}>
                            <ListItemText primary={pro.name} secondary={`Expecting ${pro.received_quantity}`} />
                            {receProducts?.some(product => product.sku === pro.sku!) && (
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
                        {receProducts.length < receProducts.length && (
                            <Grid size={12}>
                                <Box sx={{ display: 'grid', placeItems: 'center' }}>
                                    <Button variant='contained' type='submit'>Confirm</Button>
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
                        <ListItem key={pro.id} sx={{ background: '#F4F4F4' }}>
                            <ListItemText primary={pro.name} secondary={`Expecting ${pro.received_quantity} - Received ${receProducts.find(re => re.product_id == pro.id)?.received_quantity} - Damaged ${receProducts.find(re => re.product_id == pro.id)?.damaged_quantity} `} />
                        </ListItem>
                    ))}
                </List>
            </Grid>
        </Grid>,
    ];

    const validateInformation = () => {
        try {
            if (receivingData?.po_number != poNumber) {
                throw new Error('PO Number doesn\'t match!');
            }
            if (receivingData?.trailer_number != trailerNumber) {
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
                const { error } = await supabase.from('receiving_products').update({ 'damaged_quantity': pro.damaged_quantity, 'received_quantity': pro.received_quantity }).eq('receiving_id', receivingData?.id!).eq('product_id', pro.product_id);

                await supabase.from('racks_locations_products').insert({
                    'rack_location_id': 1,
                    'product_id': pro.product_id,
                    'quantity': pro.received_quantity
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
            const { data, error } = await supabase.from('receiving').update({
                'status': 'Put Away'
            }).eq('id', receivingData?.id);

            if (error) {
                throw new Error(error.message);
            }

            setReceivingData({ ...receivingData!, 'status': 'Put Away' });
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    const validatePutAwaySku = () => {
        var product = receProducts.find(rp => rp.sku == findSku);
        if (product) {
            setPutAwayProduct(product);
        }
    }

    const validatePutAwayLocation = () => {
        try {
            const rackLocation = racks
                ?.flatMap(r => r.racks_locations)
                .find(rl => rl.sku === findLocation && rl.name !== 'putaway-staging');


            if (rackLocation != null) {
                if (rackLocation.racks_locations_products.length == 0) {
                    setPutAwayRack(rackLocation);
                } else {
                    throw new Error('Location is not empty!');
                }
            } else {
                throw new Error('Location don\'t found');
            }

        } catch (error: any) {
            toast.warning(error.message);
        }
    }

    const handlePutAwayProduct = async () => {
        try {
            const { error } = await supabase
                .from('racks_locations_products')
                .update({
                    rack_location_id: putAwayRack?.id,
                    quantity: putAwayProduct?.received_quantity
                })
                .eq('product_id', putAwayProduct?.product_id);

            if (error) {
                throw new Error('Error moving product');
            }

            const updatedArray = receProducts.filter(item => item.sku !== putAwayProduct?.sku);

            setReceProducts(updatedArray);
            setPutAwayProduct(undefined);
            setPutAwayRack(undefined);
            setFindLocation(undefined);
            setFindSku(undefined);

            toast.success('Product Moved!');

            if (receProducts.length == 0) {
                try {
                    const { data, error } = await supabase.from('receiving').update({
                        'status': 'Completed'
                    }).eq('id', receivingData?.id);
        
                    if (error) {
                        throw new Error(error.message);
                    }
        
                    setReceivingData({ ...receivingData!, 'status': 'Completed' });
                } catch (error: any) {
                    toast.error(error.message);
                }
            }

        } catch (error: any) {
            toast.warning(error.message);
        }
    }

    const stepValidations: Array<() => void> = [validateInformation, validateReceivedProducts, updateReceivingStatus];

    useEffect(() => {
        getRecivingData(params['po_number']![0]);
    }, [params]);

    return (
        <Box>
            {receivingData?.status == 'New' && (
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
                            <Box sx={{ display: 'flex', justifyContent: activeStep > 0 ? 'space-between' : 'center', width: 400, margin: '10px auto' }}>
                                {activeStep > 0 && (
                                    <Button variant='contained' onClick={() => setActiveStep(activeStep - 1)}>Back</Button>
                                )}
                                <Button variant='contained' onClick={stepValidations[activeStep]}>{(activeStep + 1) == steps.length ? 'Complete' : 'Next'}</Button>
                            </Box>
                        </Block>
                    </Grid>
                </Grid>
            )}
            {receivingData?.status == 'Put Away' && (
                <Grid container spacing={2}>
                    <Grid size={4}>
                        <Block>
                            <List>
                                {receProducts?.map((pro) => (
                                    <ListItem key={pro.sku} sx={{ background: receProducts?.some(product => product.sku === pro.sku!) ? '#F4F4F4' : 'transparent' }}>
                                        <ListItemText primary={pro.name} secondary={`Pending ${pro.received_quantity} - Sku: ${pro.sku}`} />
                                    </ListItem>
                                ))}
                            </List>
                        </Block>
                    </Grid>
                    <Grid size={8}>
                        <Block>
                            <form action="">
                                <Grid container spacing={2}>
                                    <Grid size={12}>
                                        <TextField
                                            fullWidth
                                            label="Sku"
                                            disabled={putAwayProduct != null}
                                            onChange={(event) => setFindSku(event.target.value)}
                                            onKeyDown={(event) => {
                                                if (event.key === 'Enter') {
                                                    validatePutAwaySku();
                                                }
                                            }}
                                            slotProps={{
                                                input: {
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                edge="end"
                                                                onClick={validatePutAwaySku}
                                                            >
                                                                <SearchIcon />
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid size={12}>
                                        <TextField
                                            fullWidth
                                            label="Location"
                                            disabled={putAwayRack != null}
                                            onChange={(event) => setFindLocation(event.target.value)}
                                            onKeyDown={(event) => {
                                                if (event.key === 'Enter') {
                                                    validatePutAwayLocation();
                                                }
                                            }}
                                            slotProps={{
                                                input: {
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                edge="end"
                                                                onClick={validatePutAwayLocation}
                                                            >
                                                                <SearchIcon />
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }
                                            }}
                                        />
                                    </Grid>
                                    {putAwayProduct != null && putAwayRack != null && (
                                        <Grid size={12}>
                                            <Button variant='contained' onClick={handlePutAwayProduct}>Put Away</Button>
                                        </Grid>
                                    )}
                                </Grid>
                            </form>
                        </Block>
                    </Grid>
                </Grid>
            )
            }
            {receivingData?.status == 'Completed' && (
                <Grid container spacing={2}>
                    <Grid size={12}>
                        <Block sx={{ display: 'grid', placeItems: 'center'}}>
                            <Typography variant='h5'>This Receiving is completed!</Typography>
                        </Block>
                    </Grid>
                </Grid>
            )}
        </Box >
    )
}

export default ReceivingDetails
