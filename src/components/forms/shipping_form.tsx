import { Autocomplete, Box, TextField } from '@mui/material'
import React, { useContext, useState } from 'react'
import Grid from '@mui/material/Grid2'
import { ShippingContent, ShippingInput } from '@/utils/interfaces';
import { SubmitHandler, useForm } from 'react-hook-form';
import { NumberField } from '@/style/global';
import SubmitButton from '@/components/submit_button'
import { toast } from 'react-toastify';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { GlobalContext } from '@/utils/context/global_provider';

const ShippingForm = ({ defaultData, setOpenModal }: { defaultData?: ShippingContent, setOpenModal?: (status: boolean) => void }) => {

    const {
        register,
        setValue,
        getValues,
        handleSubmit,
        formState: { errors },
    } = useForm<ShippingInput>({});

    const router = useRouter();
    const supabase = createClient();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { userAccount, carriers } = useContext(GlobalContext);

    const carriersOptions = carriers!.map(carrier => ({
        value: carrier.id,
        label: carrier.name
    }));

    const handleCreateOrder: SubmitHandler<ShippingInput> = async (formData) => {
        try {
            setIsLoading(true);

            const { data: newOrder, error: orderError } = await supabase.from('shippings_orders').insert({ ...formData, 'created_by': userAccount?.id, }).select().single();

            if (orderError) {
                throw new Error(orderError.message);
            }

            const { data: newNoti, error } = await supabase.from('notifications').insert({
                'title': 'Shipping Order Created',
                'text': 'Someone has cerate a new shipping order.',
                'type': 'Shipping',
                'status': 'New',
                'redirect_to': `/shipping/${newOrder['trailer_number']}`,
                'created_by': userAccount?.id,
            }).select().single();

            if (error) {
                throw new Error(error.message);
            }

            for (var role of [1, 3]) {
                await supabase.from('roles_notifications').insert({
                    'notification_id': newNoti!['id'],
                    'role_id': role,
                });
            }

            setTimeout(() => {
                setIsLoading(false);
                router.push(`shipping/${formData.trailer_number}`);
            }, 1500);

        } catch (error: any) {
            setIsLoading(false);
            toast.warning(error.message);
        }
    }

    return (
        <Box sx={{ flexGrow: 1, padding: 5 }}>
            <form onSubmit={handleSubmit(handleCreateOrder)}>
                <Grid container spacing={2}>
                    <Grid size={12}>
                        <Autocomplete
                            fullWidth
                            disablePortal
                            options={carriersOptions}
                            defaultValue={carriersOptions.find(r => r.label === defaultData?.carrier) || null}
                            onInputChange={(event, newValue) => {
                                const selectedValue = carriersOptions.find(v => v.label === newValue)?.label;
                                setValue('carrier', selectedValue!);
                            }}
                            renderInput={
                                (params) => <TextField
                                    {...params}
                                    label="Carrier"
                                    required
                                />
                            }
                        />
                    </Grid>
                    <Grid size={12}>
                        <NumberField
                            required
                            fullWidth
                            label="Dock Door"
                            type='number'
                            {...register('dock_door', { required: 'PL Number is required' })}
                            error={!!errors.dock_door}
                            helperText={errors.dock_door?.message}
                        />
                    </Grid>
                    <Grid size={12}>
                        <TextField
                            fullWidth
                            required
                            label="Trailer #"
                            {...register('trailer_number', { required: 'Trailer Number is required' })}
                            error={!!errors.trailer_number}
                            helperText={errors.trailer_number?.message}
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

export default ShippingForm
