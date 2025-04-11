import { Box, TextField } from '@mui/material'
import React, { useContext, useState } from 'react'
import Grid from '@mui/material/Grid2';
import { SubmitHandler, useForm } from 'react-hook-form';
import SubmitButton from '@/components/submit_button'
import { toast } from 'react-toastify';
import { createClient } from '@/utils/supabase/client';
import { VendorsContent } from '@/utils/interfaces';
import { GlobalContext } from '@/utils/context/global_provider';
import { convertTimeByTimeZone } from '@/utils/functions/main';

const VendorsForm = ({ defaultData, setOpenModal }: { defaultData?: VendorsContent, setOpenModal?: (status: boolean) => void }) => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const supabase = createClient();
    const { userAccount } = useContext(GlobalContext);

    const {
        register,
        setValue,
        handleSubmit,
    } = useForm<VendorsContent>({
        defaultValues: {
            ...defaultData
        }
    });

    const handleCreateVendor: SubmitHandler<VendorsContent> = async (formData) => {
        try {
            setIsLoading(true);

            const { data: uniqueQuery, error: uniqueError } = await supabase.from('vendors').select().eq('name', formData['name']).maybeSingle();

            if (uniqueQuery != null) {
                throw new Error('Name duplicated');
            }

            const { data, error } = await supabase.from('vendors').insert({
                'name': formData['name'],
                'created_by': userAccount?.user_id,
                'created_at': convertTimeByTimeZone(userAccount?.sessionTimeZone!)
            }).select();

            if (error) {
                throw new Error(error.message);
            }

            toast.success('Vendor Created!');

        } catch (error: any) {
            toast.error(error.message);
        }
        setIsLoading(false);
        setOpenModal!(false);
    }

    return (
        <Box sx={{ flexGrow: 1, padding: 5 }}>
            <form onSubmit={handleSubmit(handleCreateVendor)}>
            <Grid container spacing={2}>
                <Grid size={12}>
                    <TextField
                        fullWidth
                        required
                        label="Name"
                        {...register('name', { required: 'Name is required' })}
                    />
                </Grid>
                <Grid size={12}>
                    <SubmitButton fullWidth={true} btnText='Create' isLoading={isLoading} variant='contained' />
                </Grid>
            </Grid>
            </form>
        </Box>
    )
}

export default VendorsForm
