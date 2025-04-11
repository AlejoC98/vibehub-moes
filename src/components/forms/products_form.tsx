'use client'
import Grid from '@mui/material/Grid2';
import React, { useContext } from 'react'
import { ProductInput } from '@/utils/interfaces'
import { convertTimeByTimeZone, generateRandomNumberString } from '@/utils/functions/main';
import { toast } from 'react-toastify';
import { NumericFormat, PatternFormat } from 'react-number-format';
import QrCodeIcon from '@mui/icons-material/QrCode';
import { createClient } from '@/utils/supabase/client';
import { SubmitHandler, useForm } from 'react-hook-form';
import { GlobalContext } from '@/utils/context/global_provider';
import { Box, Button, IconButton, TextField } from '@mui/material';

const ProductsForm = ({ defaultData, setOpenModal }: { defaultData?: ProductInput, setOpenModal?: (status: boolean) => void }) => {

  const supabase = createClient();
  const { userAccount } = useContext(GlobalContext);

  const {
    register,
    setValue,
    watch,
    handleSubmit,
  } = useForm<ProductInput>({
    defaultValues: {
      ...defaultData
    }
  });

    const productSku = watch('sku');

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
          'sku': formData["sku"],
          'name': formData["name"],
          'unit_price': formData["unit_price"],
          'total_price': formData["total_price"],
          'created_by': userAccount?.user_id,
          'created_at': convertTimeByTimeZone(userAccount?.sessionTimeZone!)
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
                label={productSku == undefined ? 'Sku' : ''}
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
              {...register('name', { required: 'Name is required' })}
            />
          </Grid>
          <Grid size={12}>
          {/* <PatternFormat
            format="mo-####-##-@-@"
            allowEmptyFormatting
            mask="_"
            onValueChange={(values) => {
              console.log('Raw value:', values.value);
              console.log('Formatted value:', values.formattedValue);
            }}
          /> */}
          <TextField
              fullWidth
              required
              label="Item"
              {...register('name', { required: 'Name is required' })}
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
