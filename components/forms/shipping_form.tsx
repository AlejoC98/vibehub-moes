import { Box, TextField } from '@mui/material'
import React from 'react'
import Grid from '@mui/material/Grid2';

const ShippingForm = () => {
    return (
        <Box>
            <Grid container spacing={5}>
                <Grid size={6}>
                    <TextField />
                </Grid>
                <Grid size={6}>
                    <TextField />
                </Grid>
                <Grid size={6}>
                    <TextField />
                </Grid>
                <Grid size={6}>
                    <TextField />
                </Grid>
            </Grid>
        </Box>
    )
}

export default ShippingForm
