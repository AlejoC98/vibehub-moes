import React, { ReactElement, useContext, useState } from 'react'
import Grid from '@mui/material/Grid2';
import { Block, NumberField } from '@/style/global';
import { ReceivingProductsInput, ShippingContent, ShippingInput } from '@/utils/interfaces';
import { Autocomplete, Box, Button, Step, StepLabel, Stepper, TextField } from '@mui/material'
import { SubmitHandler, useForm } from 'react-hook-form';
import { GlobalContext } from '@/utils/context/global_provider';
import SubmitButton from '../submit_button';
import { convertTimeByTimeZone } from '@/utils/functions/main';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'react-toastify';

const steps = [
  'Order Information',
  'Order Products',
  'Reviewing',
];

const ShippingForm = () => {

  const supabase = createClient();
  const { carriers, userAccount } = useContext(GlobalContext);

  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingInput>({
    // defaultValues: {
    //     ...defaultData
    // }
  });

  const carriersOptions = carriers!.map(carrier => ({
    value: carrier.id,
    label: carrier.name
  }));

  const [poNumber, setPoNumber] = useState<string>();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [trailerNumber, setTrailerNumber] = useState<string>();
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [receProducts, setReceProducts] = useState<ReceivingProductsInput[]>([]);


  const handleValidateProduct: SubmitHandler<ReceivingProductsInput> = async (formData) => { }
  
  const createShippingOrder: SubmitHandler<ShippingInput> = async (formData) => {
    try {
      setIsLoading(true);

      const { data: newOrder, error: orderError } = await supabase.from('shippings_orders').insert({
        ...formData,
        'status': 'Incomplete',
        'closed_by': null,
        'created_by': userAccount?.user_id,
        'created_at': convertTimeByTimeZone(userAccount?.sessionTimeZone!)
      }).select().single();

      if (orderError) {
        throw new Error(orderError.message);
      }


      setActiveStep(activeStep + 1);

    } catch (error: any) {
      setIsLoading(false);
      toast.warning(error.message);
    }
  }

  const validateReceivedProducts = async () => { }

  const updateReceivingStatus = async () => { }

  const stepValidations: Array<SubmitHandler<ShippingInput>> = [
    createShippingOrder, validateReceivedProducts, updateReceivingStatus
  ];

  const stepContent: Array<ReactElement> = [
    <Grid container spacing={2}>
      <Grid size={12}>
        <Autocomplete
          fullWidth
          disablePortal
          options={carriersOptions}
          defaultValue={null}
          onInputChange={(event, newValue) => {
            const selectedValue = carriersOptions.find(v => v.label === newValue)?.label;
            setValue('carrier', selectedValue!);
          }}
          renderInput={
            (params) => <TextField
              {...params}
              label="Carrier"
              required
            />
          }
        />
      </Grid>
      <Grid size={12}>
        <NumberField
          required
          fullWidth
          label="Dock Door"
          type='number'
          {...register('dock_door', { required: 'PL Number is required' })}
          error={!!errors.dock_door}
          helperText={errors.dock_door?.message}
        />
      </Grid>
      <Grid size={12}>
        <TextField
          fullWidth
          required
          label="Trailer #"
          {...register('trailer_number', { required: 'Trailer Number is required' })}
          error={!!errors.trailer_number}
          helperText={errors.trailer_number?.message}
        />
      </Grid>
    </Grid>,
    <Grid container spacing={2}>
      
    </Grid>,
  ];

  return (
    <Box sx={{ flexGrow: 1, padding: 5 }}>
      <Grid container spacing={5}>
        <Grid size={12}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <form onSubmit={handleSubmit(stepValidations[activeStep])}>
            <Box sx={{ maxWidth: 600, margin: '5rem auto' }}>
              {stepContent[activeStep]}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: activeStep > 0 ? 'space-between' : 'center', width: 400, margin: '10px auto' }}>
              {activeStep > 0 && (
                <Button variant='contained' onClick={() => setActiveStep(activeStep - 1)}>Back</Button>
              )}
              <SubmitButton btnText='Next' isLoading={isLoading} />
            </Box>
          </form>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ShippingForm