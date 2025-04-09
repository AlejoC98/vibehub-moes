import React, { useContext, useState } from 'react'
import Grid from '@mui/material/Grid2'
import { TextField, Typography } from '@mui/material'
import { SubmitHandler, useForm } from 'react-hook-form';
import { TicketInput } from '@/utils/interfaces';
import { toast } from 'react-toastify';
import SubmitButton from '@/components/submit_button'
import { createClient } from '@/utils/supabase/client';
import { GlobalContext } from '@/utils/context/global_provider';

const TicketForm = () => {

    const supabase = createClient();
    const { userAccount } = useContext(GlobalContext);

    const {
        reset,
        register,
        handleSubmit,
    } = useForm<TicketInput>({});

    const [isLaoding, setIsLoading] = useState<boolean>(false);

    const handleSubmitTicket: SubmitHandler<TicketInput> = async (formData) => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase.from('tickets').insert({
                ...formData,
                'created_by': userAccount?.user_id,
            });

            if (error) {
                throw new Error(error.message);
            }

            reset();
            toast.success('Ticket Submited!');
        } catch (error: any) {
            toast.warning(error.message);
        }
        setIsLoading(false);
    }

    return (
        <form onSubmit={handleSubmit(handleSubmitTicket)}>
            <Grid container spacing={2}>
                <Grid size={12}>
                    <Typography variant='h5' fontWeight='bold'>Still Have Questions? We're Here to Help!</Typography>
                </Grid>
                <Grid size={12}>
                    <Typography>Contact our support team for personalized assistance. Your satisfaction is our priority! Write your question below and we'll get back to you shortly.</Typography>
                </Grid>
                <Grid size={{ xl: 6, lg: 6, md: 12, sm: 12, xs: 12}}>
                    <TextField
                        fullWidth
                        required
                        label="Your Name"
                        {...register('full_name', { required: 'Name is required' })}
                    />
                </Grid>
                <Grid size={{ xl: 6, lg: 6, md: 12, sm: 12, xs: 12}}>
                    <TextField
                        fullWidth
                        required
                        label="Username"
                        {...register('username', { required: 'Name is required' })}
                    />
                </Grid>
                <Grid size={12}>
                    <TextField
                        fullWidth
                        required
                        label="Message"
                        {...register('message', { required: 'Name is required' })}
                        multiline
                        rows={5}
                    />
                </Grid>
                <Grid size={12}>
                    <SubmitButton fullWidth={true} isLoading={isLaoding} btnText='Submit' style={{ background: '#146c7f'}}/>
                </Grid>
            </Grid>
        </form>
    )
}

export default TicketForm