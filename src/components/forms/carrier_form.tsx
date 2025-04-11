import React, { useContext, useState } from 'react'
import { Box, TextField } from '@mui/material'
import Grid from '@mui/material/Grid2'
import SubmitButton from '@/components/submit_button'
import { SubmitHandler, useForm } from 'react-hook-form'
import { createClient } from '@/utils/supabase/client'
import { CarriersContent } from '@/utils/interfaces'
import { toast } from 'react-toastify'
import { GlobalContext } from '@/utils/context/global_provider'
import { convertTimeByTimeZone } from '@/utils/functions/main'

const CarrierForm = ({ defaultData, setOpenModal }: { defaultData?: CarriersContent, setOpenModal?: (status: boolean) => void }) => {

    const supabase = createClient();
    const { userAccount } = useContext(GlobalContext);
    const [isLoading, setIsLoading, ] = useState<boolean>(false);

    const {
        register,
        setValue,
        handleSubmit,
    } = useForm<CarriersContent>({
        defaultValues: {
            ...defaultData
        }
    });

    const handleCreateCarrier: SubmitHandler<CarriersContent> = async (formData) => {
        try {
            setIsLoading(true);

            const { data: uniqueQuery, error: uniqueError } = await supabase.from('carriers').select().eq('name', formData['name']).maybeSingle();

            if (uniqueQuery != null) {
                throw new Error('Name duplicated');
            }

            const { data, error } = await supabase.from('carriers').insert({
                'name': formData['name'],
                'created_by': userAccount?.user_id,
                'created_at': convertTimeByTimeZone(userAccount?.sessionTimeZone!)
            }).select();

            if (error) {
                throw new Error(error.message);
            }

            toast.success('Carrier Created!');

        } catch (error: any) {
            toast.error(error.message);
        }
        setIsLoading(false);
        setOpenModal!(false);
    }

    return (
        <Box sx={{ flexGrow: 1, padding: 5 }}>
            <form onSubmit={handleSubmit(handleCreateCarrier)}>
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
                        <SubmitButton fullWidth={true} btnText={Object.keys(defaultData!).length > 0 ? 'Update' : 'Create'} isLoading={isLoading} variant='contained' />
                    </Grid>
                </Grid>
            </form>
        </Box>
    )
}

export default CarrierForm
