'use client'
import React, { useContext, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import { Block } from '../../style/global';
import SearchIcon from '@mui/icons-material/Search';
import { Button, IconButton, InputAdornment, List, ListItem, ListItemText, TextField } from '@mui/material';
import { RackLocationContent, ReceivingProductsInput, ReceivingContent, ReceivingProductsContent } from '../../utils/interfaces';
import { GlobalContext } from '../../utils/context/global_provider';
import { toast } from 'react-toastify';
import { createClient } from '../../utils/supabase/client';

const PutAwayTask = ({ data, updateData } : { data: ReceivingContent, updateData: (data: ReceivingContent) => void}) => {

    const supabase = createClient();
    const { racks } = useContext(GlobalContext);

    const [findSku, setFindSku] = useState<string>();
    const [putAwayProduct, setPutAwayProduct] = useState<ReceivingProductsInput>();
    const [findLocation, setFindLocation] = useState<string>();
    const [putAwayRack, setPutAwayRack] = useState<RackLocationContent>();
    const [completeProducts, setCompletedProducts] = useState<number[]>([]);
    const [pendingProducts, setPendingProducts] = useState<ReceivingProductsContent[]>([]);

    const validatePutAwaySku = () => {
        const product = data.receiving_products?.find(rp => rp.products.sku == findSku)
        if (product) {
            setPutAwayProduct({
                id: product.products.id,
                product_id: product.products.id,
                sku: product.products.sku!,
                name: product.products.name,
                expected_quantity: product.expected_quantity,
                received_quantity: product.received_quantity,
                damaged_quantity: product.damage_quantity
            });
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
                .eq('product_id', putAwayProduct?.product_id).eq('rack_location_id', 1);

            if (error) {
                setPutAwayProduct(undefined);
                setPutAwayRack(undefined);
                throw new Error('Error moving product');
            }
            setCompletedProducts((prev) => [...prev, putAwayProduct?.product_id!]);
            setPutAwayProduct(undefined);
            setPutAwayRack(undefined);
            setFindLocation(undefined);
            setFindSku(undefined);

            toast.success('Product Moved!');

        } catch (error: any) {
            toast.warning(error.message);
        }
    }

    const validatePendingProducts = async () => {
        var products = [];
        for (var pro of data?.receiving_products!) {
            // const { data: rlpQuery, error } = await supabase.from('racks_locations_products').select().eq('rack_location_id', 1).eq('product_id', pro.product_id).maybeSingle();

            // if (rlpQuery != null) {
            // }
            products.push(data?.receiving_products);
        }

        setPendingProducts(data?.receiving_products!);

        if (products?.length == 0) {
            if (completeProducts.length == 0) {
                try {
                    const { error } = await supabase.from('receiving').update({
                        'status': 'Completed'
                    }).eq('id', data?.id);
        
                    if (error) {
                        throw new Error(error.message);
                    }

                    updateData({...data, 'status': 'Completed'});
                } catch (error: any) {
                    toast.error(error.message);
                }
            }
        }
    }

    useEffect(() => {
        validatePendingProducts();
    }, [])
    useEffect(() => {
        const validatStatus = async () => {
            if (completeProducts.length == pendingProducts.length) {
                try {
                    const { error } = await supabase.from('receiving').update({
                        'status': 'Completed'
                    }).eq('id', data?.id);
        
                    if (error) {
                        throw new Error(error.message);
                    }
                    updateData({...data, 'status': 'Completed'});
                } catch (error: any) {
                    toast.error(error.message);
                }
            }
        }

        if (pendingProducts.length != 0) {
            validatStatus();
        }
    }, [completeProducts])

    return (
        <Grid container spacing={10}>
            <Grid size={{ lg: 4, md: 5, sm: 12, xs: 12}}>
                <Block>
                    <List>
                        {pendingProducts?.map((item) => {
                            if (!completeProducts.includes(item.product_id)) {
                                return (
                                    <ListItem key={item.products.sku}>
                                    <ListItemText primary={item.products.name} secondary={`Pending ${item.received_quantity} - Sku: ${item.products.sku}`} />
                                </ListItem>
                                )
                            }
                        })}
                    </List>
                </Block>
            </Grid>
            <Grid size={{ lg: 8, md: 7, sm: 12, xs: 12 }}>
                <Block>
                    <form action="">
                        <Grid container spacing={2}>
                            <Grid size={12}>
                                <TextField
                                    fullWidth
                                    label="Sku"
                                    value={findSku || ''}
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
                                    value={findLocation || ''}
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

export default PutAwayTask
