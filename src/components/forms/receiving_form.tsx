import { Autocomplete, Box, Checkbox, FormControl, IconButton, InputAdornment, InputLabel, List, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuItem, Select, TextField, Typography } from '@mui/material'
import React, { useContext, useEffect, useRef, useState } from 'react'
import Grid from '@mui/material/Grid2'
import { GlobalContext } from '@/utils/context/global_provider'
import { ProductContent, ReceivingContent } from '@/utils/interfaces'
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import SubmitButton from '@/components/submit_button'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { NumberField } from '@/style/global'
import { createClient } from '@/utils/supabase/client'
import CustomDatePicker from '@/components/date_picker'

const ReceivingForm = ({ defaultData, setOpenModal }: { defaultData?: ReceivingContent, setOpenModal?: (status: boolean) => void }) => {

    const supabase = createClient();
    const { products, users, vendors, userAccount } = useContext(GlobalContext);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [checked, setChecked] = useState<{ product_id: number; quantity: number }[]>([]);
    const [searchData, setSearchData] = useState<ProductContent[]>([]);
    const serachRef = useRef<HTMLInputElement | null>(null);

    const {
        register,
        setValue,
        control,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm<ReceivingContent>({});

    const usOptions = users!.map(user => ({
        value: user.id,
        label: user.username
    }));

    const veOptions = vendors!.map(vendor => ({
        value: vendor.id,
        label: vendor.name
    }));

    const handleToggle = (productId: number) => () => {
        const currentIndex = checked.findIndex(item => item.product_id === productId);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push({
                product_id: productId,
                quantity: 1,
            });
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const handleQuantityChange = (productId: number, newQuantity: number) => {
        setChecked(prev =>
            prev.map(item =>
                item.product_id === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    const handleSearch = (key: string) => {
        if (key !== "") {
            key = key.toLowerCase();
            const search = products!.filter(row => Object.values(row).find(record => record?.toString().toLowerCase().includes(key)));
            setSearchData(search);
        } else {
            setSearchData(products!);
        }
    }

    const handleCleanSearch = () => {
        setSearchData(products!);
        serachRef.current!.querySelector('input')!.value = "";
    }

    const handleCreateReceiving: SubmitHandler<ReceivingContent> = async (formData) => {
        try {
            setIsLoading(true);

            if (checked.length == 0) {
                throw new Error('You need to specify what items are you specting!');
            }

            const { data: uniqueQuery, error: uniqueError } = await supabase.from('receiving').select().eq('po_number', formData['po_number']).maybeSingle();

            if (uniqueQuery != null) {
                throw new Error('Receiving number already exist!');
            }

            const { data: newReceiving, error: newReError } = await supabase.from('receiving').insert({
                'po_number': formData['po_number'],
                'vendor_id': formData['vendor_id'],
                'arrived_at': formData['arrived_at'],
                'trailer_number': formData['trailer_number'],
                'created_by': userAccount?.user_id
            }).select().single();

            if (newReError) {
                throw new Error(newReError.message);
            }

            for (var pro of checked) {
                const { data, error} = await supabase.from('receiving_products').insert({
                    'receiving_id': newReceiving.id,
                    'product_id': pro.product_id,
                    'expected_quantity': pro.quantity,
                    'created_by': userAccount?.user_id
                });
            }

            toast.success('Receiving created!');

        } catch (error: any) {
            toast.error(error.message);
        }
        setOpenModal!(false);
        setIsLoading(false);
    }

    useEffect(() => {
        setSearchData(products!);
    }, []);

    return (
        <Box sx={{ flexGrow: 1, padding: 5 }}>
            <form onSubmit={handleSubmit(handleCreateReceiving)}>
                <Grid container spacing={2}>
                    <Grid size={12}>
                        <NumberField
                            required
                            fullWidth
                            type='number'
                            label='PO Number'
                            {...register('po_number', { required: 'PO Number is required' })}
                            error={!!errors.po_number}
                            helperText={errors.po_number?.message}
                        />
                    </Grid>
                    <Grid size={6}>
                        <Autocomplete
                            fullWidth
                            disablePortal
                            options={veOptions}
                            defaultValue={veOptions.find(r => r.value === defaultData?.vendor_id) || null}
                            onInputChange={(event, newValue) => {
                                const selectedValue = veOptions.find(v => v.label === newValue)?.value;
                                setValue('vendor_id', selectedValue!);
                            }}
                            renderInput={
                                (params) => <TextField
                                    {...params}
                                    label="Vendor"
                                    required
                                />
                            }
                        />
                    </Grid>
                    <Grid size={6}>
                        <Autocomplete
                            fullWidth
                            disablePortal
                            options={usOptions}
                            defaultValue={usOptions.find(r => r.value === defaultData?.assign_to) || null}
                            onInputChange={(event, newValue) => {
                                const selectedValue = usOptions.find(v => v.label === newValue)?.value;
                                setValue('assign_to', selectedValue!);
                            }}
                            renderInput={
                                (params) => <TextField
                                    {...params}
                                    label="Assign to"
                                    required
                                />
                            }
                        />
                    </Grid>
                    <Grid size={7}>
                        <Controller
                            name="arrived_at"
                            control={control}
                            rules={{ required: 'Arrived Date is required' }}
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <CustomDatePicker
                                    label="Arrived Date"
                                    value={value || null}
                                    onChange={onChange}
                                    slotProps={{
                                        textField: {
                                            required: true,
                                            fullWidth: true,
                                            error: !!error,
                                            helperText: error?.message,
                                        },
                                    }}
                                />
                            )}
                        />
                    </Grid>
                    <Grid size={5}>
                        <Box sx={{ pt: 1 }}>
                            <TextField
                                fullWidth
                                required
                                label="Trailer Number"
                                {...register('trailer_number', { required: 'Trailer Number is required' })}
                                error={!!errors.trailer_number}
                                helperText={errors.trailer_number?.message}
                            />
                        </Box>
                    </Grid>
                    <Grid size={12}>
                        <Typography variant='h5' align='center'>Items</Typography>
                    </Grid>
                    <Grid size={12}>
                        <Box sx={{ mb: 2 }}>
                            <TextField
                                fullWidth
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder='Search'
                                ref={serachRef}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                {searchData.length > 0 && (
                                                    <IconButton onClick={handleCleanSearch}>
                                                        <CloseIcon />
                                                    </IconButton>
                                                )}
                                            </InputAdornment>
                                        )
                                    }
                                }}
                            />
                        </Box>
                    </Grid>
                    <Grid size={12}>
                        <Box sx={{ maxHeight: 300, overflowY: 'scroll', background: '#F4F4F4' }}>
                            <List>
                                {searchData?.map(item => {
                                    const labelId = `checkbox-list-label-${item.id}`;
                                    return (
                                        <ListItem
                                            key={item.id}
                                            sx={{ borderBottom: '1px solid #DEDEDE' }}
                                            secondaryAction={
                                                checked.some(product => product.product_id === item.id!) &&
                                                <TextField
                                                    type='number'
                                                    size="small"
                                                    defaultValue={1}
                                                    inputProps={{ min: 1 }}
                                                    onChange={(value) => {
                                                        let parsedValue = parseInt(value.currentTarget.value, 10);

                                                        if (isNaN(parsedValue)) {
                                                            parsedValue = 1;
                                                        }

                                                        if (parsedValue < 1) {
                                                            parsedValue = 1;
                                                        }

                                                        handleQuantityChange(item.id!, parsedValue);
                                                        handleQuantityChange(item.id!, parseInt(value.currentTarget.value))
                                                    }}
                                                    sx={{ maxWidth: 100 }}
                                                />
                                            }>
                                            <ListItemButton role={undefined} onClick={handleToggle(item.id!)} dense>
                                                <ListItemIcon>
                                                    <Checkbox
                                                        edge="start"
                                                        checked={checked.some(product => product.product_id === item.id!)}
                                                        tabIndex={-1}
                                                        disableRipple
                                                        slotProps={{
                                                            input: {
                                                                'aria-labelledby': labelId
                                                            }
                                                        }}
                                                    />
                                                </ListItemIcon>
                                                <ListItemText id={labelId} primary={item.name} />
                                            </ListItemButton>
                                        </ListItem>
                                    )
                                })}
                            </List>
                        </Box>
                    </Grid>
                    <Grid size={12}>
                        <SubmitButton fullWidth={true} variant='contained' isLoading={isLoading} btnText='Create' />
                    </Grid>
                </Grid>
            </form>
        </Box>
    )
}

export default ReceivingForm
