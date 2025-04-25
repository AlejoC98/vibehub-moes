'use client';
import { Box, TextField } from '@mui/material'
import React, { useState } from 'react'
import Grid from '@mui/material/Grid2';
import { useForm } from 'react-hook-form';
import { UpdateReportInput } from '@/utils/interfaces';
import SubmitButton from '../submit_button';
import ImageDropzone from '../image_dropzone';

const UpdateReportForm = () => {

    const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
    } = useForm<UpdateReportInput>({});

    const [reportIMG, setReportIMG] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <Box sx={{ flexGrow: 1, padding: 5 }}>
        <Grid container spacing={5}>
            <Grid size={12}>
                <TextField
                    fullWidth
                    label='Title'
                    {...register('title', { required: 'Title is required' })}
                    error={!!errors.title}
                    helperText={errors.title?.message}
                />
            </Grid>
            <Grid size={12}>
                <TextField
                    fullWidth
                    multiline
                    label='Content'
                    {...register('content', { required: 'Content is required' })}
                    error={!!errors.content}
                    helperText={errors.content?.message}
                />
            </Grid>
            <Grid size={12}>
            <ImageDropzone
                productIMG={reportIMG}
                setProductIMG={setReportIMG}
            />
            </Grid>
            <Grid size={12}>
                <SubmitButton
                    className='btn-munsell'
                    btnText='Submit'
                    fullWidth={true}
                    isLoading={isLoading}
                />
            </Grid>
        </Grid>
    </Box>
  )
}

export default UpdateReportForm
