'use client'
import Grid from '@mui/material/Grid2';
import React, { forwardRef, useContext, useState } from 'react'
import { ProductInput } from '@/utils/interfaces'
import { convertTimeByTimeZone, generateRandomNumberString, handleUploadToBucket } from '@/utils/functions/main';
import { toast } from 'react-toastify';
import QrCodeIcon from '@mui/icons-material/QrCode';
import { createClient } from '@/utils/supabase/client';
import { SubmitHandler, useForm } from 'react-hook-form';
import { GlobalContext } from '@/utils/context/global_provider';
import { Box, IconButton, TextField } from '@mui/material';
import { IMaskInput } from 'react-imask';
import SubmitButton from '@/components/submit_button';
import ImageDropzone from '@/components/image_dropzone';

interface CustomMaskProps {
  name: string;
  onChange: (event: { target: { name: string; value: string } }) => void;
}

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
  const [productIMG, setProductIMG] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCreateSku = () => {
    const sku = generateRandomNumberString(15);
    setValue('sku', sku);
  }

  const hanldeNewProduct: SubmitHandler<any> = async (formData) => {
    try {

      setIsLoading(true);
      const productURL = await handleUploadToBucket('products', formData["sku"], productIMG!);

      const { error } = await supabase.from('products').upsert({
        ...formData,
        'img_url': productURL.signedUrl,
        'created_by': userAccount?.user_id,
        'created_at': convertTimeByTimeZone(userAccount?.sessionTimeZone!)
      }, { onConflict : 'id'});

      if (error) {
        throw new Error(error.message);
      }
      setOpenModal!(false);
      toast.success('Product Created!');
    } catch (error: any) {
      console.error(error);
      toast.warning(error.message);
    }
    setIsLoading(false);
  }

  const MaskedInput = forwardRef<HTMLInputElement, CustomMaskProps>(
    function MaskedInput(props, ref) {
      const { onChange, ...other } = props;

      return (
        <IMaskInput
          {...other}
          mask="MO-0000-00-a-a"
          definitions={{
            a: /[a-zA-Z]/,
          }}
          overwrite
          lazy={false}
          inputRef={ref}
           prepare={(str) => str.toUpperCase()}
          onAccept={(value: any) =>
            onChange({ target: { name: props.name, value } })
          }
        />
      );
    }
  );

  return (
    <Box sx={{ flexGrow: 1, padding: 5 }}>
      <form onSubmit={handleSubmit(hanldeNewProduct)}>
        <Grid container spacing={2}>
          <Grid size={12}>           
            <ImageDropzone productIMG={productIMG} setProductIMG={setProductIMG} />
          </Grid>
          <Grid size={12}>
            <TextField
              label="Item Code"
              variant="outlined"
              {...register('item', { required: 'Item is required' })}
              fullWidth
              slotProps={{
                input: {
                  inputComponent: MaskedInput as any,
                }
              }}
            />
          </Grid>
          <Grid size={6}>
            <TextField
              fullWidth
              required
              label="Name"
              {...register('name', { required: 'Name is required' })}
            />
          </Grid>
          <Grid size={6}>
            <TextField
              fullWidth
              required
              disabled
              placeholder='Click button to generate sku'
              label={productSku == undefined ? 'Sku' : ''}
              {...register('sku', { required: 'Sku is required' })}
              slotProps={{
                input: {
                  endAdornment: <IconButton sx={{ background: '#b2b2b2', color: '#FFFFFF'}} disabled={defaultData!.sku !== undefined} className="bg-emerald-600 hover:bg-emerald-800 text-white" onClick={handleCreateSku}><QrCodeIcon /></IconButton>
                }
              }}
            />
          </Grid>
          <Grid size={12}>
            <SubmitButton fullWidth={true} isLoading={isLoading} btnText='Create' className='btn-munsell' />
          </Grid>
        </Grid>
      </form>
    </Box>
  )
}

export default ProductsForm
