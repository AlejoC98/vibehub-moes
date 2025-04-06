'use client'
import { Autocomplete, Box, Button, Divider, IconButton, InputAdornment, List, ListItem, ListItemText, TextField, Typography, useMediaQuery, useTheme } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import Grid from '@mui/material/Grid2';
import { PickListInput, PickListContent, ShippingContent } from '../../utils/interfaces';
import { SubmitHandler, useForm } from 'react-hook-form';
import { NumberField } from '../../style/global';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import SubmitButton from '../submit_button';
import { toast } from 'react-toastify';
import { createClient } from '../../utils/supabase/client';
import { GlobalContext } from '../../utils/context/global_provider';
import { useParams } from 'next/navigation';

interface CustomPickList extends ShippingContent, PickListContent {}

const PickListForm = ({ defaultData, setOpenModal }: { defaultData?: CustomPickList, setOpenModal?: (status: boolean) => void }) => {

    const params = useParams();
    const supabase = createClient();
    const { shippings, users, userAccount } = useContext(GlobalContext);

    const {
        register,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm<PickListInput>({
        defaultValues: {
            ...defaultData,
        }
    });

    const usersOptions = users
        ?.filter(user =>
            user.accounts_roles?.some(role => role.role_id === 5)
        ).map(user => ({
            value: user.id,
            label: user.username
        })) || [];

    const teamLeadOptions = users
        ?.filter(user =>
            user.accounts_roles?.some(role => role.role_id === 3)
        ).map(user => ({
            value: user.id,
            label: user.username
        })) || [];


    const [shippedProducts, setShippedProducts] = useState<Array<{ sku: string, quantity: number }>>([]);
    const [shippedProductSku, setShippedProductSku] = useState<string>('');
    const [shippedProductError, setShippedProductError] = useState<string | null>(null);
    const [shippedProductQty, setShippedProductQty] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [orderId, setOrderId] = useState<string>();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleAddProducts = () => {
        var existingPro = shippedProducts.find(p => p.sku == shippedProductSku);
        if (existingPro != null) {
            setShippedProductError('Product Already Added!');
            setTimeout(() => {
                setShippedProductError(null);
            }, 4000);
        } else {
            if (shippedProductQty != null && shippedProductQty <= 0) {
                setShippedProductError('Quantity can\'t be zero!');
            } else {
                setShippedProducts((prev) => [...prev, { sku: shippedProductSku, quantity: shippedProductQty! }]);
                setShippedProductSku('');
                setShippedProductQty(null);
            }
        }
    }

    const handleRemoveProductByIndex = (indexToRemove: number) => {
        setShippedProducts((prev) => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleCreateRecord: SubmitHandler<PickListInput> = async (formData) => {
        try {
            setIsLoading(true);
            if (shippedProducts.length <= 0) {
                throw new Error('You need to add prodcuts to create the record!');
            }

            const totalQuantity = shippedProducts.reduce((sum, item) => sum + item.quantity, 0);

            const newStatus = await supabase.from('shippings_pick_list').insert({
                ...formData,
                'shipping_order_id': orderId,
                'total_products': totalQuantity,
                'bol_number': `MOES${formData['bol_number']}`,
                'created_by': userAccount?.id,
            }).select().single();

            if (newStatus.error != null) {
                throw new Error(newStatus.error.message);
            }

            for (var product of shippedProducts) {
                const newSPStatus = await supabase.from('shippings_products').insert({
                    'shipping_pick_list_id': newStatus.data['id'],
                    'product_sku': product['sku'],
                    'product_quantity': product['quantity'],
                    'created_by': userAccount?.id,
                });

                if (newSPStatus.error != null) {
                    await supabase.from('shippings').delete().eq('id', newStatus.data['id']);
                    throw new Error(newSPStatus.error.message);
                }
            }

            setOpenModal!(false);
            toast.success('Record Created!');

        } catch (error: any) {
            toast.warning(error.message);
        }

        setIsLoading(false);
    }

    const loadShippingProducts = () => {
        // const currentShipping = shippings?.find(s => s.trailer_number == defaultData?.trailer_number);

        if (defaultData?.shippings_products != null) {
            for (var item of defaultData?.shippings_products) {
                setShippedProducts((prev) => [...prev, { sku: item.product_sku, quantity: item.product_quantity }]);
            }
            // for (var order of currentShipping.shippings_pick_list) {}
        }
    }

    useEffect(() => {
        var currentShipping = shippings?.find(s => s.trailer_number == params?.trailer);

        if (currentShipping != null) {
            setOrderId(currentShipping.id.toString());
        }

        if (defaultData != undefined && Object.keys(defaultData).length > 0) {
            loadShippingProducts();
        }
    }, [defaultData])

    return (
        <Box sx={{ flexGrow: 1, padding: 5 }}>
            <form onSubmit={handleSubmit(handleCreateRecord)}>
                <Grid container spacing={2}>
                    <Grid size={{ lg: 6, md: 6, sm: 12, xs: 12 }}>
                        <NumberField
                            required
                            fullWidth
                            label="PL Number"
                            type='number'
                            {...register('pl_number', { required: 'PL Number is required' })}
                            error={!!errors.pl_number}
                            helperText={errors.pl_number?.message}
                        />
                    </Grid>
                    <Grid size={{ lg: 6, md: 6, sm: 12, xs: 12 }}>
                        <NumberField
                            required
                            fullWidth
                            label="BOL #"
                            type='number'
                            slotProps={{
                                input: {
                                    startAdornment: <InputAdornment position="start">MOES</InputAdornment>,
                                },
                            }}
                            {...register('bol_number', { required: 'We need to know whom verified!' })}
                            error={!!errors.bol_number}
                            helperText={errors.bol_number?.message}
                        />
                    </Grid>
                    <Grid size={{ lg: 6, md: 6, sm: 12, xs: 12 }}>
                        <Autocomplete
                            fullWidth
                            disablePortal
                            options={usersOptions}
                            value={usersOptions.find(r => r.label === defaultData?.picker_name) || null}
                            onInputChange={(event, newValue) => {
                                const selectedValue = usersOptions.find(v => v.label === newValue)?.label;
                                setValue('picker_name', selectedValue!);
                            }}
                            renderInput={
                                (params) => <TextField
                                    {...params}
                                    label="Picker Name"
                                    required
                                />
                            }
                        />
                    </Grid>
                    <Grid size={{ lg: 6, md: 6, sm: 12, xs: 12 }}>
                        <Autocomplete
                            fullWidth
                            disablePortal
                            options={teamLeadOptions}
                            value={teamLeadOptions.find(r => r.label === defaultData?.verified_by) || null}
                            onInputChange={(event, newValue) => {
                                const selectedValue = teamLeadOptions.find(v => v.label === newValue)?.label;
                                setValue('verified_by', selectedValue!);
                            }}
                            renderInput={
                                (params) => <TextField
                                    {...params}
                                    label="Verified By"
                                    required
                                />
                            }
                        />
                        <Typography sx={{ fontSize: 12, color: '#989898'}}>Only Team Leands can Verified</Typography>
                    </Grid>
                    <Grid size={12}>
                        <Box sx={{ border: '1px solid', borderRadius: 1, borderColor: '#c6c6c6', padding: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '0 5rem' }}>
                                <Typography>Sku</Typography>
                                <Typography>Qty</Typography>
                            </Box>
                            <Divider />
                            <Box sx={{ display: 'flex', flexDirection: 'column', maxHeight: 300, overflowY: 'scroll' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', m: 1, flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 1 : 0 }}>
                                    <TextField
                                        size='small'
                                        placeholder={isMobile ? 'Product Sku' : ''}
                                        value={shippedProductSku || ''}
                                        onChange={(event) => {
                                            setShippedProductSku(event.target.value);
                                        }}
                                    />
                                    <TextField
                                        size='small'
                                        type='number'
                                        placeholder={isMobile ? 'Product Quantity' : ''}
                                        slotProps={{
                                            htmlInput: { min: 0 },
                                        }}
                                        value={shippedProductQty || ''}
                                        onChange={(event) => {
                                            setShippedProductQty(parseInt(event.target.value));
                                        }}
                                    />
                                </Box>
                                {shippedProductError != null && (
                                    <Typography sx={{ textAlign: 'center', m: '1rem 0' }}>{shippedProductError}</Typography>
                                )}
                                <List sx={{ background: shippedProducts.length > 0 ? '#f1f1f1' : 'transparent' }}>
                                    {shippedProducts.map((product, index) => (
                                        <ListItem key={index}>
                                            <ListItemText
                                                primary={product.sku}
                                                secondary={`Quantity: ${product.quantity}`}
                                            />
                                            <IconButton onClick={() => handleRemoveProductByIndex(index)} aria-label="delete">
                                                <DeleteIcon />
                                            </IconButton>
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                            <Divider />
                            <Box sx={{ display: 'grid', placeItems: 'center' }}>
                                <Button
                                    variant='text'
                                    startIcon={<AddCircleOutlineIcon />}
                                    onClick={handleAddProducts}
                                >
                                    Add Item
                                </Button>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid size={12}>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label='Notes'
                            {...register('notes')}
                        />
                    </Grid>
                    <Grid size={12}>
                        <SubmitButton fullWidth={true} variant='contained' isLoading={isLoading} btnText={Object.keys(defaultData!).length > 0 ? 'Update' : 'Create'} />
                    </Grid>
                </Grid>
            </form>
        </Box>
    )
}

export default PickListForm
