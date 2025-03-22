'use client'
import { Box, Button, IconButton, TextField } from '@mui/material'
import React, { useState } from 'react'
import Grid from '@mui/material/Grid2';
import QrCodeIcon from '@mui/icons-material/QrCode';
import { generateBarcodesWithSeparator, generateRandomNumberString } from '../../utils/functions/main';
import { RackContent } from '../../utils/interfaces';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { createClient } from '../../utils/supabase/client';

const RacksForm = ({ defaultData, setOpenModal }: { defaultData?: RackContent, setOpenModal?: (status: boolean) => void }) => {

  const supabase = createClient();

  const {
    register,
    setValue,
    handleSubmit
  } = useForm<RackContent>();

    const handleCreateSku = () => {
      const sku = generateRandomNumberString(15);
      setValue('sku',sku);
    }
  
    const handleAddRack: SubmitHandler<RackContent> = async(formData) => {
     try {
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
            await supabase.from('racks_locations').insert({
              'rack_id': newRack['id'],
              'name': location,
              'sku': generateRandomNumberString(15),
            });

          }
          toast.success('Section created!');
        }
      }

      if (error) {
        throw new Error(error.message);
      }
     } catch (error: any) {
      toast.error(error.message);
     }
    }

  return (
<Box sx={{ flexGrow: 1, padding: 5 }}>
      <form onSubmit={handleSubmit(handleAddRack)}>
        <Grid container spacing={5}>
          {/* <Grid size={12}>
            <TextField
              fullWidth
              required
              disabled
              label="Sku"
              variant="filled"
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
              variant="filled"
              {...register('name')}
            />
          </Grid>
          <Grid size={6}>
            <TextField
              fullWidth
              label="Columns"
              type="number"
              variant="filled"
              {...register('columns')}
            />
          </Grid>
          <Grid size={6}>
            <TextField
              fullWidth
              label="Rows"
              type="number"
              variant="filled"
              {...register('rows')}
            />
          </Grid>
          <Grid size={12}>
            <Button fullWidth variant="contained" type="submit" className="bg-orange-700 hover:bg-orange-900">Create</Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  )
}

export default RacksForm
