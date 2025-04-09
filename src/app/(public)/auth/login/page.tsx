'use client'
import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid2';
import Image from 'next/image';
import { Box, Button, useMediaQuery, useTheme } from '@mui/material';
import LoginForm from '@/components/forms/login_form';

const Login = () => {

    const [shrink, setShrink] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (isMobile) {
                setShrink(true);
            } else {
                setShrink(false);
            }
        }, 500);

        return () => clearTimeout(timeout);
    }, [isMobile]);

    return (
        <Grid container spacing={2} sx={{ width: '100%' }}>
            <Grid size={12}>
                <Box sx={{ transition: 'all 2s ease-in-out', padding: '20px 10px', display: 'flex', justifyContent: shrink ? 'center' : 'normal'}}>
                    <Image
                        alt='logo'
                        width={shrink ? 200 : 300}
                        height={shrink ? 70 :100}
                        style={{ }}
                        sizes='100vh'
                        src='/static/img/logos/vibehub-horizontal-white-logo.png'
                    />
                </Box>
            </Grid>
            <Grid size={{ lg: 6, md: 6, sm: 12 }} sx={{ margin: '0 auto' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {/* <SplashLogo /> */}
                    <Image
                        alt='auth'
                        width={shrink ? 300 : 600}
                        height={shrink ? 300 : 600}
                        style={{ transition: 'all 2s ease-in-out' }}
                        sizes='100vh'
                        src='/static/img/bg-auth-1.png'
                    />
                </Box>
            </Grid>
            <Grid size={{ lg: 6, md: 6, sm: 12 }} sx={{ margin: '0 auto' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '5rem 0' : 0, margin: '0' }}>
                    <LoginForm />
                </Box>
            </Grid>
        </Grid>
    )
}

export default Login
