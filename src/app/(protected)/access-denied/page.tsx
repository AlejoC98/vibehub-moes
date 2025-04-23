'use client'
import { GlobalContext } from '@/utils/context/global_provider';
import { Box, Typography } from '@mui/material';
import React, { useContext, useEffect } from 'react'
import Grid from '@mui/material/Grid2'
import Block from '@/components/block';

const AccessDenied = () => {

    const { setIsLaunching } = useContext(GlobalContext);

    useEffect(() => {
        setIsLaunching(false);
    }, [])

  return (
    <Box>
        <Grid container spacing={5}>
            <Grid size={12}>
                <Block sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', placeItems: 'center', gap: 1.5}}>
                    <Typography textAlign='center' variant='h1'>403</Typography>
                    <Typography textAlign='center' variant='h6'>Access Denied</Typography>
                    <Typography textAlign='center' >Sorry, but you don't have permission to access this page.</Typography>
                    <Typography textAlign='center' >You can get back to <strong>previous page</strong>.</Typography>
                    <img src="/static/img/access-denied.png" style={{ objectFit: 'contain', width: '100%', maxWidth: 700}} alt="" />
                </Block>
            </Grid>
        </Grid>
    </Box>
  )
}

export default AccessDenied
