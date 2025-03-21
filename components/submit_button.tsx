import { LoadingButton } from '@mui/lab'
import React, { ReactNode } from 'react'

const SubmitButton = ( { fullWidth, variant, styles, icon, btnText, isLoading = false } : { fullWidth: boolean, variant: "text" | "outlined" | "contained", styles?: string, icon?: ReactNode, btnText: string, isLoading: boolean}) => {
  return (
    <LoadingButton
        className={styles}
        fullWidth={fullWidth}
        loading={isLoading}
        loadingPosition="start"
        startIcon={icon}
        variant={variant}
        type='submit'
    >
        { btnText }
  </LoadingButton>
  )
}

export default SubmitButton
