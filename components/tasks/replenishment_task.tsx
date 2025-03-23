'use client'
import { Box, Button, IconButton, InputAdornment, Step, StepLabel, Stepper, TextField, Typography } from '@mui/material';
import React, { ReactElement, useState } from 'react'
import Grid from '@mui/material/Grid2';
import SearchIcon from '@mui/icons-material/Search';

const steps = [
    'Welcome',
    'Select Product',
    'Move To',
    'Confirm',
];

const ReplenishmentTask = () => {

    const [activeStep, setActiveStep] = useState<number>(0);

    const passWelcomePage = () => setActiveStep(activeStep + 1);

    const stepValidations: Array<() => void> = [passWelcomePage];

    const validationOriginLocation = async () => {

    }

    const stepContent: Array<ReactElement> = [
        <Grid container spacing={2}>
            <Grid size={12}>
                <Typography align='center' variant='h4'>Welcome to the Product Movement Tool</Typography>
            </Grid>
            <Grid size={12}>
                <Typography align='center'>Before you proceed, please take a moment to review the following:</Typography>
                <Typography align='center'>Moving products between locations is a critical task, so accuracy is key. Double-check the product details, quantities, and the destination location to ensure everything is correct.</Typography>
                <Typography align='center'>Make sure you have the correct product and that it matches the SKU provided. Be careful with quantities and confirm that the destination is accurate to avoid any errors. Once the product is moved, it will be updated across the system, so this action is permanent.</Typography>
                <Typography align='center'>Take your time, verify everything, and move the product securely. If you're unsure at any point, don't hesitate to ask for assistance.</Typography>
                <Typography align='center'>Let's get started safely!</Typography>
            </Grid>
        </Grid>,
        <Grid container spacing={2}>
            <Grid size={12}>
                <TextField
                    fullWidth
                    required
                    label='Location'
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            validationOriginLocation();
                        }
                    }}
                    slotProps={{
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        edge="end"
                                        onClick={validationOriginLocation}
                                    >
                                        <SearchIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }
                    }}
                />
            </Grid>
            <Grid size={12}>
                <TextField
                    fullWidth
                    required
                    label='Quantity'
                />
            </Grid>
        </Grid>
    ];
    return (
        <Box>
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <Box sx={{ maxWidth: 600, margin: '5rem auto' }}>
                {stepContent[activeStep]}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: activeStep > 0 ? 'space-between' : 'center', width: 400, margin: '10px auto' }}>
                {activeStep > 0 && (
                    <Button variant='contained' onClick={() => setActiveStep(activeStep - 1)}>Back</Button>
                )}
                <Button variant='contained' onClick={stepValidations[activeStep]}>{(activeStep + 1) == steps.length ? 'Complete' : 'Next'}</Button>
            </Box>
        </Box>
    )
}

export default ReplenishmentTask
