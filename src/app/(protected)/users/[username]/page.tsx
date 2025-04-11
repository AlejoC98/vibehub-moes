'use client'
import { GlobalContext } from '@/utils/context/global_provider';
import { Avatar, Box, Chip, List, ListItem, ListItemText, Skeleton, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import Grid from '@mui/material/Grid2';
import { Block } from '@/style/global';
import Details from '@/components/details';
import { Building03Icon, Location01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { createClient } from '@/utils/supabase/client';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { AccountContent } from '@/utils/interfaces';
import SubmitButton from '@/components/submit_button';
import { toast } from 'react-toastify';
import { resetPassword } from '@/utils/functions/server';
import { convertTimeByTimeZone } from '@/utils/functions/main';

interface UserDetailsContent extends AccountContent {
    email_verified?: boolean;
    last_sign_in_at?: string;
}

const UserDetails = () => {

    const params = useParams();
    const supabase = createClient();
    const { userAccount, setIsLaunching, users } = useContext(GlobalContext);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [userData, setUserData] = useState<UserDetailsContent>();
    const tables = [
        'accounts',
        'carriers',
        'picking',
        'picking_products',
        'racks',
        'racks_locations',
        'racks_locations_products',
        'receivings',
        'receivings_products',
        'shippings_orders',
        'shippings_pick_list',
        'shippings_products',
    ];

    const loadUserData = async () => {
        try {
            const userRecord = users?.find(u => u.username == params?.username!);

            if (userRecord != null) {
                setUserData(userRecord);
            }

            console.log(userAccount?.accounts_roles?.find(r => r.role_id == 1 || r.role_id == 2) != null);

            if (userAccount?.accounts_roles?.find(r => r.role_id == 1 || r.role_id == 2) != null) {
                await axios.post('/api/users/', {
                    'username': params?.username!
                }).then((res) => {
                    if (res.data.status) {
                        setUserData({
                            ...userRecord,
                            ...res.data.data,
                        });
                    }
                }).catch((err) => {
                    console.log(err);
                });
            }
        } catch (error: any) {
            console.log(error.message);
        }
    }

    // const loadUserHistory = async () => {
    //     try {
    //         const results: any = {};

    //         for (const table of tables) {
    //             const { data, error } = await supabase
    //                 .from(table)
    //                 .select('*')
    //                 .eq('created_by', userData?.user_id);

    //             if (error) {
    //                 console.error(`Error fetching from ${table}:`, error.message);
    //             }

    //             results[table] = data || [];
    //         }
    //     } catch (error: any) {
    //         toast.warning(error.message):
    //     }
    // }

    const sendResetEmailToUser = async () => {
        try {
            setIsLoading(true);
            const resetStatus = await resetPassword(userData?.email!);

            setIsLoading(false);
            if (resetStatus) {
                toast.success('Email send, Please check your email.');
            }
        } catch (error: any) {
            toast.warning(error.message);
        }
    }

    useEffect(() => {
        setIsLaunching(false);
    }, []);

    useEffect(() => {
        loadUserData();
    }, [users, userAccount]);

    return (
        <Box>
            {userData != null ? (
                <Details actionButtons={[]} title='User Information'>
                    <Grid size={{ xl: 4, lg: 12, md: 12, sm: 12, xs: 12 }}>
                        <Block>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    placeItems: 'center',
                                    gap: 2,
                                    marginBottom: 2
                                }}
                            >
                                <Avatar
                                    alt={`${userData.first_name} ${userData.last_name}`}
                                    src="/static/images/avatar/1.jpg"
                                    sx={{ width: 120, height: 120 }}
                                />
                                <Box
                                    sx={{
                                        display: 'flex',
                                        placeItems: 'center',
                                        justifyContent: 'center',
                                        gap: {
                                            xl: 5,
                                            lg: 5,
                                            md: 5,
                                            sm: 1,
                                            xs: 1
                                        },
                                        flexDirection: {
                                            xl: 'row',
                                            lg: 'row',
                                            md: 'row',
                                            sm: 'column',
                                            xs: 'column'
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            placeItems: 'center',
                                            gap: 1,
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <HugeiconsIcon size={15} icon={Building03Icon} />
                                        <Typography sx={{ fontSize: 14 }}>
                                            {userData?.locations.name}
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            placeItems: 'center',
                                            gap: 1,
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <HugeiconsIcon size={15} icon={Location01Icon} />
                                        <Typography sx={{ fontSize: 14 }}>
                                            city, state
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                                    {userData?.accounts_roles?.map((r) => (
                                        <Chip key={r.id} label={r.roles.name || ''} />
                                    ))}
                                </Box>
                            </Box>
                            <Grid container spacing={5}>
                                <Grid size={6}>
                                    <Typography variant="h6" fontWeight="bold" textAlign='center'>
                                        Basic Info:
                                    </Typography>
                                    <List>
                                        <ListItem>
                                            <ListItemText
                                                primary="Name"
                                                secondary={`${userData.first_name} ${userData.last_name}`}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText primary="Email" secondary={userData.email} />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText primary="Username" secondary={userData.username} />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText primary="Phone" secondary={userData.phone} />
                                        </ListItem>
                                        <ListItem>
                                            <SubmitButton
                                                isLoading={isLoading}
                                                btnText='Reset Password'
                                                className='btn-munsell'
                                                onClick={sendResetEmailToUser}
                                            />
                                        </ListItem>
                                    </List>
                                </Grid>
                                <Grid size={6}>
                                    <Typography variant="h6" fontWeight="bold" textAlign='center'>
                                        More Info:
                                    </Typography>
                                    <List>
                                        <ListItem>
                                            <ListItemText
                                                primary="Last Sign in"
                                                secondary={convertTimeByTimeZone(userAccount?.sessionTimeZone!, userData.last_sign_in_at!)}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText
                                                primary="Email Verified"
                                                secondary={userData.email ? 'Yes' : 'No'}
                                            />
                                        </ListItem>
                                    </List>
                                </Grid>
                            </Grid>
                        </Block>
                    </Grid>
                    <Grid size={{ xl: 8, lg: 12, md: 12, sm: 12, xs: 12 }}>
                        <Block>
                            <Typography variant='h4' fontWeight='bold'>Action History</Typography>
                        </Block>
                    </Grid>
                </Details>
            ) : (
                <Box>
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                    <Skeleton variant="circular" width={40} height={40} />
                    <Skeleton variant="rectangular" width={210} height={60} />
                    <Skeleton variant="rounded" width={210} height={60} />
                </Box>
            )}
        </Box>
    )
}

export default UserDetails
