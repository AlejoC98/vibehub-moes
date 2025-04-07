import React, { useContext, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import { AccountContent } from '../../utils/interfaces';
import { GlobalContext } from '../../utils/context/global_provider';
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import Grid from '@mui/material/Grid2';
import SubmitButton from '../submit_button';
import { toast } from 'react-toastify';
import { createClient } from '../../utils/supabase/client';
import { signup } from '@/app/(public)/auth/login/actions';
import MultipleSelectChip from '../multi_select_chip';


const UsersForms = ({ defaultData, setOpenModal }: { defaultData?: AccountContent, setOpenModal?: (status: boolean) => void }) => {

    const supabase = createClient();
    const { roles, userAccount, users } = useContext(GlobalContext);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<AccountContent>({
        defaultValues: {
            ...defaultData,
        }
    });
    
    const [selectedRoles, setSelectedRoles] = useState<number[]>([]);

    const canSeeManager = userAccount?.accounts_roles?.some(role => role.id === 1 || role.id === 2);

    const poOptions = roles!.filter(item => canSeeManager || item.name !== 'Manager').map(item => ({ id: item.id, name: item.name }));


    const handleCreateUser: SubmitHandler<AccountContent> = async (data) => {
        try {
            setIsLoading(true);

            var userId = undefined;
            
            if (Object.keys(defaultData!).length == 0) {
                const userData = await signup(data['email']!, process.env.DEFAULT_PASSWORD || 'v1b3h0b2025', false);

                userId =  userData?.user?.id;
            } else {
                userId =  defaultData?.user_id;
            }

            if (userId != undefined) {
                const { data: newAccount, error } = await supabase.from('accounts').upsert({
                    'first_name': data['first_name'],
                    'last_name': data['last_name'],
                    'user_id': userId,
                    'location_id': 1,
                    'email': data['email'],
                    'username': data['username']
                }, { onConflict: 'email' }).select().single();

                if (error) {
                    throw new Error(error.message);
                }
                
                await supabase.from('accounts_roles').delete().eq('account_id', newAccount.id);
                // Assing Roles
                for (var role of selectedRoles) {
                    const { data, error } = await supabase.from('accounts_roles').insert({ account_id: newAccount.id, role_id: role });

                    if (error) {
                        throw new Error(error.message);
                    }
                }

                toast.success(`User ${Object.keys(defaultData!).length > 0 ? 'updated' : 'created'}!`);
                setIsLoading(false);
                setOpenModal!(false);
            }
        } catch (error: any) {
            setIsLoading(false);
            toast.error(error.message)
        }
    }

    const loadUserRoles = async() => {
        var editedUser = users?.find(u => u.id == defaultData?.id!);
        if (editedUser != null) {
            const roleIds = editedUser!.accounts_roles!.map(role => role.role_id);
            setSelectedRoles(roleIds);
        }
    }

    useEffect(() => {
        if (defaultData != undefined && Object.keys(defaultData).length > 0) {
            loadUserRoles();
        }
    }, [defaultData])

    return (
        <Box sx={{ flexGrow: 1, padding: 5 }}>
            <form onSubmit={handleSubmit(handleCreateUser)}>
                <Grid container spacing={2}>
                    <Grid size={6}>
                        <TextField
                            fullWidth
                            required
                            label="Email"
                            {...register('email', { required: 'First Name is required' })}
                            error={!!errors.email}
                            helperText={errors.email?.message || 'Used for password resets'}
                        />
                    </Grid>
                    <Grid size={6}>
                        <TextField
                            label="First Name"
                            required
                            fullWidth
                            {...register('first_name', { required: 'First Name is required' })}
                            error={!!errors.first_name}
                            helperText={errors.first_name?.message}
                        />
                    </Grid>
                    <Grid size={6}>
                        <TextField
                            label="Last Name"
                            required
                            fullWidth
                            {...register('last_name', { required: 'Last Name is required' })}
                            error={!!errors.last_name}
                            helperText={errors.last_name?.message}
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
                        <MultipleSelectChip
                            options={poOptions}
                            value={selectedRoles}
                            onChange={setSelectedRoles}
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

export default UsersForms