'use client'
import { Autocomplete, Box, Button, Divider, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material'
import React, { useContext, useState } from 'react'
import Grid from '@mui/material/Grid2';
import { NumberField } from '../../style/global';
import { Controller, useForm } from 'react-hook-form';
import { PickingContent, PickingProductContent } from '../../utils/interfaces';
import { GlobalContext } from '../../utils/context/global_provider';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CustomDatePicker from '../date_picker';


const PickingForm = ({ defaultData, setOpenModal }: { defaultData?: PickingContent, setOpenModal?: (status: boolean) => void }) => {

    const { products, users, vendors } = useContext(GlobalContext);

    const {
        register,
        setValue,
        control,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm<PickingContent>({});

    const usOptions = users!.map(user => ({
        value: user.id,
        label: user.username
    }));

    const [pickPriority, setPickPriority] = useState('');
    const [pickingProducts, setPickingProducts] = useState<PickingProductContent
    >();

    return (
        <Box sx={{ flexGrow: 1, padding: 5 }}>
            <Grid container spacing={2}>
                <Grid size={12}>
                    <NumberField
                        required
                        fullWidth
                        type='number'
                        label='Order Number'
                        {...register('order_number', { required: 'Order Number is required' })}
                        error={!!errors.order_number}
                        helperText={errors.order_number?.message}
                    />
                </Grid>
                <Grid size={12}>
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
                        name="due_at"
                        control={control}
                        rules={{ required: 'Due Date is required' }}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <CustomDatePicker
                                label="Due Date"
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
                <Grid size={5} sx={{ pt: 1}}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Priority</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={pickPriority}
                            label="Priority"
                            onChange={(event: SelectChangeEvent) => {
                                setPickPriority(event.target.value as string);
                            }}
                        >
                            <MenuItem value={10}>Urgent</MenuItem>
                            <MenuItem value={20}>High</MenuItem>
                            <MenuItem value={30}>Normal</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid size={12}>
                    <Box sx={{ border: '1px solid', borderColor: 'rgba(0, 0, 0, 0.12)', padding: 1, borderRadius: 1}}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between'}}>
                            <Typography>Item to pick</Typography>
                            <Typography>Quantity</Typography>
                        </Box>
                        <Divider />
                        <Box sx={{ margin: '1rem 0'}}>
                           
                        </Box>
                        <Divider />
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <Button variant="text" startIcon={<AddCircleOutlineIcon />}>Add Item</Button>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}

export default PickingForm
