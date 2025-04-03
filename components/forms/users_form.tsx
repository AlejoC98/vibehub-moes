import React, { useContext, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import { UserContent } from '../../utils/interfaces';
import { GlobalContext } from '../../utils/context/global_provider';
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import Grid from '@mui/material/Grid2';
import SubmitButton from '../submit_button';
import { toast } from 'react-toastify';
import { createClient } from '../../utils/supabase/client';
import { signup } from '@/app/(public)/auth/login/actions';

const UsersForms = ({ defaultData, setOpenModal }: { defaultData?: any, setOpenModal?: (status: boolean) => void }) => {

    const supabase = createClient();
    const { roles } = useContext(GlobalContext);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const poOptions = roles!.map(item => ({
        value: item.id,
        label: item.name
    }));

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<UserContent>({
        defaultValues: {
            ...defaultData,
        }
    });

    const handleCreateReceiving: SubmitHandler<UserContent> = async (data) => {
        try {
            setIsLoading(true);
            
            const userData = await signup(data['email']!, process.env.DEFAULT_PASSWORD || 'v1b3h0b2025', false);

            if (userData.user) {
                const { data: newAccount, error} = await supabase.from('accounts').insert({
                    'first_name': data['firstName'],
                    'last_name': data['lastName'],
                    'user_id': userData.user.id,
                    'location_id': 1,
                    'role_id': data['roleId'],
                    'username': data['username']
                }).select();

                if (error) {
                    throw new Error(error.message);
                }

                toast.success('User created!');
                setIsLoading(false);
                setOpenModal!(false);
            }
        } catch (error: any) {
            setIsLoading(false);
            toast.error(error.message)
        }
    }

    return (
        <Box sx={{ flexGrow: 1, padding: 5 }}>
            <form onSubmit={handleSubmit(handleCreateReceiving)}>
                <Grid container spacing={2}>
                    <Grid size={6}>
                        <TextField
                            fullWidth
                            required
                            label="Email"
                            {...register('email', { required: 'First Name is required' })}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />
                    </Grid>
                    <Grid size={6}>
                        <TextField
                            label="First Name"
                            required
                            fullWidth
                            {...register('firstName', { required: 'First Name is required' })}
                            error={!!errors.firstName}
                            helperText={errors.firstName?.message}
                        />
                    </Grid>
                    <Grid size={6}>
                        <TextField
                            label="Last Name"
                            required
                            fullWidth
                            {...register('lastName', { required: 'Last Name is required' })}
                            error={!!errors.lastName}
                            helperText={errors.lastName?.message}
                        />
                    </Grid>
                    <Grid size={6}>
                        <TextField
                            label="username"
                            required
                            fullWidth
                            {...register('username', { required: 'Username is required' })}
                            error={!!errors.username}
                            helperText={errors.username?.message}
                        />
                    </Grid>
                    <Grid size={12}>
                        <FormControl fullWidth required>
                            <InputLabel id="demo-simple-select-label">Role</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                {...register('roleId')}
                                value={watch('roleId') || ''}
                                label="Role"
                            >
                                {poOptions.map(option => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={12}>
                        <SubmitButton fullWidth={true} variant='contained' isLoading={isLoading} btnText='Create' />
                    </Grid>
                </Grid>
            </form>
        </Box>
    )
}

export default UsersForms
