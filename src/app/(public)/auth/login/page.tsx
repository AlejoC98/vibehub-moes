'use client'
import React from 'react'
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
import { Box } from '@mui/material';
import LoginForm from '../../../../../components/forms/login_form';

// const Item = styled(Paper)(({ theme }) => ({
//     // backgroundColor: '#fff',
//     ...theme.typography.body2,
//     padding: theme.spacing(1),
//     textAlign: 'center',
//     color: theme.palette.text.secondary,
//     ...theme.applyStyles('dark', {
//         backgroundColor: '#1A2027',
//     }),
// }));

const Login = () => {
    return (
        <Grid container spacing={2} sx={{ width: '100%' }}>
            <Grid size={12}>
                <Box sx={{ padding: '20px 10px' }}>
                    <Image
                        alt='logo'
                        width={300}
                        height={100}
                        sizes='100vh'
                        className='w-full h-full max-w-44'
                        src='/static/img/logos/vibehub-horizontal-white-logo.png'
                    />

                </Box>
            </Grid>
            <Grid size={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Image
                        alt='auth'
                        width={700}
                        height={700}
                        sizes='100vh'
                        src='/static/img/bg-auth-1.png'
                        className='h-full w-full'
                    />
                </Box>
            </Grid>
            <Grid size={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LoginForm />
            </Box>
            </Grid>
        </Grid>
    )
}

export default Login
