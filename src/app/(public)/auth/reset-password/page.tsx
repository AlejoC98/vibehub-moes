'use client'
import ResetPasswordForm from '@/components/forms/reset_password_form'
import UpdatePasswordForm from '@/components/forms/update_password_form';
import { Box, Typography } from '@mui/material'
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react'

const ResetPassword = () => {

  const searchParams = useSearchParams();
  const code = searchParams.get('code');

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', placeItems: 'center', minHeight: '100vh'}}>
      <Box sx={{ background: 'rgba(29, 38, 51, .7)', borderRadius: 5, maxWidth: 500}}>
        { code == null ? (
          <ResetPasswordForm />
        ) : (
          <UpdatePasswordForm />
        ) }
      </Box>
    </Box>
  )
}

export default ResetPassword
