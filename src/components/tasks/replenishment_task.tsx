'use client'
import { Box, Button, Step, StepLabel, Stepper, TextField, Typography } from '@mui/material';
import React, { ReactElement, useContext, useState } from 'react'
import Grid from '@mui/material/Grid2';
import { GlobalContext } from '@/utils/context/global_provider';
import { convertTimeByTimeZone, deepSearch } from '@/utils/functions/main';
import { toast } from 'react-toastify';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

const steps = [
    'Welcome',
    'Select Product',
    'Move To',
    'Confirm',
];

const ReplenishmentTask = () => {

    const { racks, userAccount } = useContext(GlobalContext);
    const supabase = createClient();
    const route = useRouter()

    const [activeStep, setActiveStep] = useState<number>(0);
    const [originRackSku, setOriginRackSku] = useState<string>('');
    const [originRackQuantity, setOriginRackQuantity] = useState<string>('');
    const [originRackId, setOriginRackId] = useState<number>(0);
    const [destinyRackSku, setDestinyRackSku] = useState<string>('');
    const [destinyRackId, setDestinyRackId] = useState<number>(0);


    const passWelcomePage = () => setActiveStep(activeStep + 1);
    const validateMovement = async () => {
        try {
            const allRackLocations = racks?.flatMap(rack => rack.racks_locations);
            const response = deepSearch(allRackLocations!, originRackSku!, true);
            if (originRackSku == '' || originRackSku == undefined) {
                throw new Error('Location is required');
            }
            if (originRackQuantity == '' || originRackQuantity == undefined) {
                throw new Error('Quantity is required');
            }

            if (response.length > 0) {
                if (response[0].racks_locations_products[0].quantity < 0) {
                    throw new Error('Location is empty');
                }

                if (originRackQuantity! > response[0].racks_locations_products[0].quantity) {
                    throw new Error('There\'s not enough product to move!');
                }

                setOriginRackId(response[0].id);

                setActiveStep(activeStep + 1)
            } else {
                throw new Error('Error finding location');
            }
        } catch (error: any) {
            console.log(error.message);
            toast.warning("Something went wrong."

);
        }
    }

    const validateDestiny = () => {
        try {
            const allRackLocations = racks?.flatMap(rack => rack.racks_locations);

            if (destinyRackSku == '' || destinyRackSku == undefined) {
                throw new Error('Location is required');
            }

            const response = deepSearch(allRackLocations!, destinyRackSku!, true);

            if (response.length === 0) {
                throw new Error('Error finding location');
            }

            if (response[0].racks_locations_products.length > 0 && response[0].racks_locations_products[0].quantity > 0) {
                throw new Error('There is stock in this location, cannot proceed.');
            }

            setDestinyRackId(response[0].id);

            setActiveStep(activeStep + 1);
        } catch (error: any) {
            console.log(error.message);
            toast.warning("Something went wrong.");
        }
    }

    const handleMovement = async () => {
        try {
            const { data: currentQuery, error } = await supabase
            .from('racks_locations_products')
            .select('quantity, product_id')
            .eq('rack_location_id', originRackId)
            .maybeSingle();
        
        if (error) {
            throw new Error('Error fetching origin rack data');
        }
        
        if (!currentQuery || currentQuery.quantity === undefined) {
            throw new Error('Invalid rack location');
        }
        
        if (currentQuery.quantity === 0) {
            throw new Error('Location is Empty!');
        }
        
        const originQuantity = parseInt(originRackQuantity!);
        if (originQuantity > currentQuery.quantity) {
            throw new Error('Not enough quantity in origin location');
        }
        
        const newQuantity = currentQuery.quantity - originQuantity;

        const { error: updateError } = await supabase
            .from('racks_locations_products')
            .update({ quantity: newQuantity })
            .eq('rack_location_id', originRackId);
        
        if (updateError) {
            throw new Error('Error updating origin quantity');
        }

        const { data: destinyQuery, error: destinyError } = await supabase
            .from('racks_locations_products')
            .select('quantity, product_id')
            .eq('rack_location_id', destinyRackId)
            .maybeSingle();
        
        if (destinyError) {
            throw new Error('Error fetching destination rack data');
        }
        
        if (destinyQuery) {
            if (destinyQuery.product_id !== currentQuery.product_id) {
                throw new Error('Destination location has a different product');
            }
        
            const newDestinyQuantity = destinyQuery.quantity + originQuantity;
        
            const { error: updateDestinyError } = await supabase
                .from('racks_locations_products')
                .update({ quantity: newDestinyQuantity })
                .eq('rack_location_id', destinyRackId);
        
            if (updateDestinyError) {
                throw new Error('Error updating destination quantity');
            }
        } else {
            const { error: insertDestinyError } = await supabase
                .from('racks_locations_products')
                .insert({
                    'rack_location_id': destinyRackId,
                    'quantity': originQuantity,
                    'product_id': currentQuery.product_id,
                    'created_by': userAccount?.user_id,
                    'created_at': convertTimeByTimeZone(userAccount?.sessionTimeZone!)
                });
        
            if (insertDestinyError) {
                throw new Error('Error inserting new destination record');
            }
        }
        
        toast.success('Replenishment Complete');
        route.back();
        } catch (error: any) {
            console.log(error.message);
            toast.warning("Error moving product.");
        }
    }

    const stepValidations: Array<() => void> = [passWelcomePage, validateMovement, validateDestiny, handleMovement];

    const stepContent: Array<ReactElement> = [
        <Grid container spacing={2}>
            <Grid size={12}>
                <Typography align='center' variant='h4'>Welcome to the Product Movement Tool</Typography>
            </Grid>
            <Grid size={12}>
                <Typography align='center'>Please review the following before proceeding:</Typography>
                <Typography align='center'>Accuracy is crucial when moving products. Double-check the SKU, quantities, and destination location to avoid errors. Once the product is moved, the update is permanent across the system.</Typography>
                <Typography align='center'>Verify everything carefully. If you need help, feel free to ask.</Typography>
                <Typography align='center'>Let’s get started safely!.</Typography>
            </Grid>
        </Grid>,
        <Grid container spacing={2}>
            <Grid size={12}>
                <TextField
                    fullWidth
                    required
                    value={originRackSku}
                    onChange={(event) => setOriginRackSku(event.target.value)}
                    label='Move From'
                />
            </Grid>
            <Grid size={12}>
                <TextField
                    fullWidth
                    required
                    value={originRackQuantity}
                    onChange={(event) => setOriginRackQuantity(event.target.value)}
                    label='Quantity'
                />
            </Grid>
        </Grid>,
        <Grid container spacing={2}>
            <Grid size={12}>
                <TextField
                    fullWidth
                    required
                    value={destinyRackSku}
                    onChange={(event) => setDestinyRackSku(event.target.value)}
                    label='Move To'
                />
            </Grid>
        </Grid>,
        <Grid container spacing={2}>
            <Grid size={12}>
                <Typography>Moving {originRackQuantity} products from: {originRackSku}</Typography>
                <Typography>To {destinyRackSku}</Typography>
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
