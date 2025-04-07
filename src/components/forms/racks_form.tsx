'use client'
import { Box, Button, IconButton, TextField } from '@mui/material'
import React, { useState } from 'react'
import Grid from '@mui/material/Grid2';
import QrCodeIcon from '@mui/icons-material/QrCode';
import { generateBarcodesWithSeparator, generateRandomNumberString } from '@/utils/functions/main';
import { RackContent } from '@/utils/interfaces';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { createClient } from '@/utils/supabase/client';
import SubmitButton from '@/components/submit_button'

const RacksForm = ({ defaultData, setOpenModal }: { defaultData?: RackContent, setOpenModal?: (status: boolean) => void }) => {

  const supabase = createClient();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    setValue,
    handleSubmit
  } = useForm<RackContent>({
    defaultValues: {
      ...defaultData
    }
  });
  
    const handleAddRack: SubmitHandler<RackContent> = async(formData) => {
     try {
      setIsLoading(true);
      const { data: uniqueRack, error } = await supabase.from('racks').select('*').eq('name', formData['name']?.toLocaleUpperCase);
      if (uniqueRack!.length <= 0) {
        const { data: newRack, error } = await supabase.from('racks').insert({
          "name": formData['name'],
          "columns": formData['columns'],
          "rows": formData['rows'],
        }).select().maybeSingle();

        if (newRack != null) {
          var rackLocations = generateBarcodesWithSeparator(newRack['name'], newRack['columns'], newRack['rows']);

          for (var location of rackLocations) {
            const { error } = await supabase.from('racks_locations').insert({
              'rack_id': newRack['id'],
              'name': location,
              'sku': generateRandomNumberString(15),
            });

            if (error) {
              console.log(error);
            }

          }
          toast.success('Rack Location created!');
        }
      }

      if (error) {
        throw new Error(error.message);
      }
      } catch (error: any) {
        toast.error(error.message);
      }
      setIsLoading(false);
      setOpenModal!(false);
    }

  return (
<Box sx={{ flexGrow: 1, padding: 5 }}>
      <form onSubmit={handleSubmit(handleAddRack)}>
        <Grid container spacing={2}>
          {/* <Grid size={12}>
            <TextField
              fullWidth
              required
              disabled
              label="Sku"
              {...register('sku')}
              InputProps={{
                endAdornment: <IconButton disabled={defaultData!.sku !== undefined} className="bg-emerald-600 hover:bg-emerald-800 text-white" onClick={handleCreateSku}><QrCodeIcon /></IconButton>
              }}
            />
          </Grid> */}
          <Grid size={12}>
            <TextField
              fullWidth
              required
              label="Name"
              type="text"
              {...register('name')}
            />
          </Grid>
          <Grid size={6}>
            <TextField
              fullWidth
              label="Columns"
              type="number"
              {...register('columns')}
            />
          </Grid>
          <Grid size={6}>
            <TextField
              fullWidth
              label="Rows"
              type="number"
              {...register('rows')}
            />
          </Grid>
          <Grid size={12}>
            <SubmitButton fullWidth={true} variant='contained' isLoading={isLoading} btnText='Create' />
          </Grid>
        </Grid>
      </form>
    </Box>
  )
}

export default RacksForm
