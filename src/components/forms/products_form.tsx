'use client'
import React, { useContext, useState } from 'react'
import { ProductContent } from '@/utils/interfaces'
import { generateRandomNumberString } from '@/utils/functions/main';
import Grid from '@mui/material/Grid2';
import { Box, Button, IconButton, TextField } from '@mui/material';
import QrCodeIcon from '@mui/icons-material/QrCode';
import { NumericFormat } from 'react-number-format';
import { SubmitHandler, useForm } from 'react-hook-form';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'react-toastify';
import { GlobalContext } from '@/utils/context/global_provider';

const ProductsForm = ({ defaultData, setOpenModal }: { defaultData?: ProductContent, setOpenModal?: (status: boolean) => void }) => {

  const supabase = createClient();
  const { userAccount } = useContext(GlobalContext);

  const {
    register,
    setValue,
    handleSubmit,
  } = useForm<ProductContent>({
    defaultValues: {
      ...defaultData
    }
  });

    const handleCreateSku = () => {
      const sku = generateRandomNumberString(15);
      setValue('sku', sku);
    }

    const hanldeNewProduct: SubmitHandler<any> = async (formData) => {
      formData.quantity = parseInt(formData.quantity);
      formData.unit_price = parseInt(formData.unit_price, 10);
      formData.total_price = parseInt(formData.total_price, 10);

      try {
        const { data, error } = await supabase.from('products').insert({
          "sku": formData["sku"],
          "name": formData["name"],
          "unit_price": formData["unit_price"],
          "total_price": formData["total_price"],
          'created_by': userAccount?.id
        });
        if (error) {
          throw new Error(error.message);
        }
        toast.success('Product Created!');
      } catch (error) {
        console.error(error);
      }
      
    }

  return (
    <Box sx={{ flexGrow: 1, padding: 5 }}>
      <form onSubmit={handleSubmit(hanldeNewProduct)}>
        <Grid container spacing={2}>
          <Grid size={6}>
            <Box>
              <TextField
                fullWidth
                required
                disabled
                label="Sku"
                variant="filled"
                {...register('sku', { required: 'Sku is required' })}
                slotProps={{
                  input: {
                    endAdornment: <IconButton disabled={defaultData!.sku !== undefined} className="bg-emerald-600 hover:bg-emerald-800 text-white" onClick={handleCreateSku}><QrCodeIcon /></IconButton>
                  }
                }}
              />
            </Box>
          </Grid>
          <Grid size={6}>
            <TextField
              fullWidth
              required
              label="Name"
              variant="filled"
              {...register('name', { required: 'Name is required' })}
            />
          </Grid>
          <Grid size={6}>
            <NumericFormat
              prefix='$'
              thousandSeparator=","
              decimalScale={2}
              fullWidth
              required
              label="Unit Price"
              variant="filled"
              {...register('unit_price')}
              customInput={TextField}
              onValueChange={(values) => {
                if (values.floatValue !== undefined) {
                  setValue('unit_price', values.floatValue);
                }
              }}
            />
          </Grid>
          <Grid size={6}>
            <NumericFormat
              prefix='$'
              thousandSeparator=","
              decimalScale={2}
              fullWidth
              required
              label="Total Price"
              variant="filled"
              {...register('total_price')}
              customInput={TextField}
              onValueChange={(values) => {
                if (values.floatValue !== undefined) {
                  setValue('total_price', values.floatValue);
                }
              }}
            />
          </Grid>
          <Grid size={12}>
            <Button fullWidth className="bg-red-950 text-white" type='submit'>Create</Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  )
}

export default ProductsForm
