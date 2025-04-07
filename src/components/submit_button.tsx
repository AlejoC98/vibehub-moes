import { Button, ButtonProps } from '@mui/material'
import React, { ReactNode } from 'react'

interface SubmitButtonProps extends ButtonProps {
  styles?: string;
  icon?: ReactNode;
  btnText: string;
  isLoading?: boolean;
}

const SubmitButton = ( { fullWidth,
  variant = 'contained',
  styles,
  icon,
  btnText,
  isLoading = false,
  ...rest } : SubmitButtonProps) => {
  return (
    <Button
        className={styles}
        fullWidth={fullWidth}
        loading={isLoading}
        loadingPosition="start"
        startIcon={icon}
        variant={variant}
        type='submit'
        {...rest}
    >
        { btnText }
  </Button>
  )
}

export default SubmitButton
