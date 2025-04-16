import { Autocomplete, Box, TextField } from '@mui/material'
import React, { useContext, useState } from 'react'
import Grid from '@mui/material/Grid2'
import { NumberField } from '@/style/global'
import { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { ShippingContent, ShippingInput } from '@/utils/interfaces'
import { GlobalContext } from '@/utils/context/global_provider'

const CreateOrderForm = ({ defaultData, register, setValue, errors }: { defaultData?: ShippingContent, register: UseFormRegister<ShippingInput>, setValue: UseFormSetValue<ShippingInput>, errors: FieldErrors<ShippingInput> }) => {

  const { carriers, users } = useContext(GlobalContext);

  const carriersOptions = carriers!.map(carrier => ({
    value: carrier.id,
    label: carrier.name
  }));

  const usersOptions = users!.filter(user =>
    user.accounts_roles?.some(role => role.role_id === 5)
  ).map(user => ({
    value: user.user_id,
    label: user.username ?? 'Unknown User'
  }));

  const [carrierValue, setCarrierValue] = useState<{ value: number, label: string } | null>(
    carriersOptions.find(r => r.label === defaultData?.carrier) || null
  );
  
  const [assignTo, setAssignTo] = useState<{ value: string, label: string } | null>(
    usersOptions.find(r => r.value === defaultData?.assign_to) || null
  );

  return (
    <Box sx={{ flexGrow: 1, padding: 5 }}>
      <Grid container spacing={2}>
        <Grid size={{ xl: 4, lg: 4, md: 4, sm: 12, xs: 12 }}>
          <Autocomplete
            fullWidth
            disablePortal
            options={carriersOptions}
            value={carrierValue}
            onChange={(event, newValue) => {
              setCarrierValue(newValue);
              setValue('carrier', newValue?.label || '');
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Carrier"
                required
              />
            )}
          />

        </Grid>
        <Grid size={{ xl: 4, lg: 4, md: 4, sm: 12, xs: 12 }}>
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
        <Grid size={{ xl: 4, lg: 4, md: 4, sm: 12, xs: 12 }}>
          <TextField
            fullWidth
            required
            label="Trailer #"
            {...register('trailer_number', { required: 'Trailer Number is required' })}
            error={!!errors.trailer_number}
            helperText={errors.trailer_number?.message}
          />
        </Grid>
        <Grid size={12}>
          <Autocomplete
            fullWidth
            disablePortal
            options={usersOptions}
            value={assignTo}
            onChange={(event, newValue) => {
              setAssignTo(newValue);
              setValue('assign_to', newValue!.value);
            }}
            // onInputChange={(event, newValue) => {
            //   const selectedValue = usersOptions.find(v => v.value === newValue)?.label;
            // }}
            renderInput={
              (params) => <TextField
                {...params}
                label="Picker Name"
                required
              />
            }
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default CreateOrderForm
