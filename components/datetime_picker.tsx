import React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker, DateTimePickerProps } from '@mui/x-date-pickers/DateTimePicker';

interface CustomDateTimePickerProps extends Partial<DateTimePickerProps<any>> {}

const CustomDateTimePicker = (props: CustomDateTimePickerProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateTimePicker']}>
        <DateTimePicker {...props} />
      </DemoContainer>
    </LocalizationProvider>
  );
};

export default CustomDateTimePicker;