import React, { useContext, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import { AccountContent } from '@/utils/interfaces';
import { GlobalContext } from '@/utils/context/global_provider';
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import Grid from '@mui/material/Grid2';
import SubmitButton from '@/components/submit_button';
import { toast } from 'react-toastify';
import MultipleSelectChip from '@/components/multi_select_chip';
import axios from 'axios';
import Swal from 'sweetalert2';


const UsersForms = ({ defaultData, setOpenModal }: { defaultData?: AccountContent, setOpenModal?: (status: boolean) => void }) => {

    const { roles, userAccount, users } = useContext(GlobalContext);
    
    const {
        register,
        handleSubmit,
        // setValue,
        // watch,
        formState: { errors },
    } = useForm<AccountContent>({
        defaultValues: {
            ...defaultData,
        }
    });
    
    const [userType, setUserType] = useState('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedRoles, setSelectedRoles] = useState<number[]>([]);

    const canSeeManager = userAccount?.accounts_roles?.some(role => role.id === 1 || role.id === 2);

    const poOptions = roles!.filter(item => canSeeManager || item.name !== 'Manager').map(item => ({ id: item.id, name: item.name }));


    const handleCreateUser: SubmitHandler<AccountContent> = async (data) => {
        try {
            setIsLoading(true);
            await axios.post('/api/users/create/', {
                'accountType': userType,
                'defaultData': defaultData,
                'selectedRoles': selectedRoles,
                'newData': data,
            }).then((res) => {
                if (res.data.status) {
                    toast.success(res.data.message);
                } else {
                    Swal.fire({
                        icon: 'info',
                        title: "User Limit Reached",
                        text: res.data.message,
                        confirmButtonColor: '#549F93',
                        showClass: {
                            popup: `
                                animate__animated
                                animate__fadeInUp
                                animate__faster
                            `
                        },
                        hideClass: {
                            popup: `
                                animate__animated
                                animate__fadeOutDown
                                animate__faster
                            `
                        }
                    });
                }
                setIsLoading(false);
                setOpenModal!(false);
            }).catch((err) => {
                throw new Error(err.message);
            });
        } catch (error: any) {
            setIsLoading(false);
            toast.error(error.message)
        }
    }

    const loadUserRoles = async () => {
        var editedUser = users?.find(u => u.id == defaultData?.id!);
        if (editedUser != null) {
            const roleIds = editedUser!.accounts_roles!.map(role => role.role_id);
            setSelectedRoles(roleIds);
        }
    }

    useEffect(() => {
        if (defaultData != undefined && Object.keys(defaultData).length > 0) {
            loadUserRoles();
            setUserType(defaultData.email?.includes('vibehubapp.com') ? 'warehouse' : 'manager');
        }
    }, [defaultData])

    return (
        <Box sx={{ flexGrow: 1, padding: 5 }}>
            <form onSubmit={handleSubmit(handleCreateUser)}>
                <Grid container spacing={2}>
                    <Grid size={12}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">User Type</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                disabled={defaultData?.email != undefined}
                                value={userType}
                                label="User Type"
                                onChange={(event: SelectChangeEvent) => {
                                    setUserType(event.target.value as string);
                                }}
                            >
                                <MenuItem value={'manager'}>Office / Manager</MenuItem>
                                <MenuItem value={'warehouse'}>Warehouse Staff</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    {userType != '' && (
                        <>
                            {userType == 'manager' && (
                                <Grid size={{ xl: 6, lg: 6, md: 6, sm: 12, xs: 12 }}>
                                    <TextField
                                        fullWidth
                                        required
                                        label="Email"
                                        {...register('email', { required: 'First Name is required' })}
                                        error={!!errors.email}
                                        helperText={errors.email?.message || 'Used for password resets'}
                                    />
                                </Grid>
                            )}
                            <Grid size={{ xl: 6, lg: 6, md: 6, sm: 12, xs: 12 }}>
                                <TextField
                                    label="First Name"
                                    required
                                    fullWidth
                                    {...register('first_name', { required: 'First Name is required' })}
                                    error={!!errors.first_name}
                                    helperText={errors.first_name?.message}
                                />
                            </Grid>
                            <Grid size={{ xl: 6, lg: 6, md: 6, sm: 12, xs: 12 }}>
                                <TextField
                                    label="Last Name"
                                    required
                                    fullWidth
                                    {...register('last_name', { required: 'Last Name is required' })}
                                    error={!!errors.last_name}
                                    helperText={errors.last_name?.message}
                                />
                            </Grid>
                            <Grid size={{ xl: 6, lg: 6, md: 6, sm: 12, xs: 12 }}>
                                <TextField
                                    label="username"
                                    required
                                    fullWidth
                                    {...register('username', { required: 'Username is required' })}
                                    error={!!errors.username}
                                    helperText={errors.username?.message}
                                />
                            </Grid>
                            {userType == 'warehouse' && (
                                <Grid size={{ xl: 6, lg: 6, md: 6, sm: 12, xs: 12 }}>
                                    <TextField
                                        fullWidth
                                        required
                                        label="Password"
                                        {...register('password', { required: userType === 'warehouse' ? 'Password is required' : false })}
                                        error={!!errors.password}
                                        helperText={errors.password?.message}
                                    />
                                </Grid>
                            )}
                            <Grid size={12}>
                                <MultipleSelectChip
                                    options={poOptions}
                                    value={selectedRoles}
                                    onChange={setSelectedRoles}
                                />
                            </Grid>
                        </>
                    )}
                    <Grid size={12}>
                        <SubmitButton fullWidth={true} variant='contained' isLoading={isLoading} btnText={Object.keys(defaultData!).length > 0 ? 'Update' : 'Create'} />
                    </Grid>
                </Grid>
            </form>
        </Box>
    )
}

export default UsersForms