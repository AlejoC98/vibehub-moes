'use client'
import React from 'react'
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import { styled, useTheme } from '@mui/material/styles';
import Image from 'next/image';
import { Box, useMediaQuery } from '@mui/material';
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
    const theme = useTheme();
    const isExtraSmallScreen = useMediaQuery(theme.breakpoints.down('xs'));
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));
    const isLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));
    // const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));

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
            <Grid size={{ lg: 6, md: 6, sm: 12 }} sx={{ margin: '0 auto'}}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Image
                        alt='auth'
                        width={isExtraSmallScreen ? 300 : isSmallScreen ? 400 : isMediumScreen ? 450 : isLargeScreen ? 550 : 700}
                        height={isExtraSmallScreen ? 300 : isSmallScreen ? 400 : isMediumScreen ? 450 : isLargeScreen ? 550 : 700}
                        sizes='100vh'
                        src='/static/img/bg-auth-1.png'
                    />
                </Box>
            </Grid>
            <Grid size={{ lg: 6, md: 6, sm: 12 }} sx={{ margin: '0 auto'}}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isSmallScreen ? '5rem 0' : 0, margin: '0'}}>
                <LoginForm />
            </Box>
            </Grid>
        </Grid>
    )
}

export default Login
