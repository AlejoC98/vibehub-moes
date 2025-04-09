'use client'
import { Box, Typography } from '@mui/material'
import React, { useState } from 'react'
import Grid from '@mui/material/Grid2'
import { WhiteTextField } from '@/style/global'
import SubmitButton from '../submit_button'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { createClient } from '@/utils/supabase/client'
import { resetPassword } from '@/utils/functions/server'

interface resetPasswordInput {
    email: string;
}

const ResetPasswordForm = () => {

    const supabase = createClient();

    const {
        register,
        reset,
        handleSubmit,
    } = useForm<resetPasswordInput>({});

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSendResetEmail: SubmitHandler<resetPasswordInput> = async (formData) => {
        try {
            setIsLoading(true);
            const resetStatus = await resetPassword(formData.email!);

            setIsLoading(false);
            if (resetStatus) {
                toast.success('Email send, Please check your email.');
                reset();
            }
        } catch (error: any) {
            toast.warning(error.message);
        }
    }

    return (
        <Box sx={{ flexGrow: 1, padding: 5 }}>
            <form onSubmit={handleSubmit(handleSendResetEmail)}>
                <Grid container spacing={5}>
                    <Grid size={12} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography variant='h4' sx={{ color: '#FFF' }}>Reset your Password</Typography>
                        <Typography sx={{ color: '#FFF' }}>
                            The verification email will be sent to the mailbox. Please check it.
                        </Typography>
                    </Grid>
                    <Grid size={12}>
                        <WhiteTextField
                            fullWidth
                            label='Email Address'
                            {...register('email', { required: 'The email is required' })}
                        />
                    </Grid>
                    <Grid size={12}>
                        <SubmitButton
                            fullWidth={true}
                            btnText='Send Link'
                            isLoading={isLoading}
                            className='btn-bittersweet'
                        />
                    </Grid>
                </Grid>
            </form>
        </Box>
    )
}

export default ResetPasswordForm