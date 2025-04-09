import React, { FormEvent, useState } from 'react';
import Grid from '@mui/material/Grid2';
import { Box, Button, IconButton, InputAdornment, Link, Typography } from '@mui/material';
import { WhiteTextField } from '@/style/global';
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';
import KeyIcon from '@mui/icons-material/Key';
import SubmitButton from '@/components/submit_button'
import { login } from '@/app/(public)/auth/login/actions';
import { toast } from 'react-toastify';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const LoginForm = () => {
  const [loading, setIsloading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsloading(true);

    var status = await login(username, password);

    toast.warning(status);
    setIsloading(false);
  }

  return (
    <Box sx={{ maxWidth: 500 }}>
      <form onSubmit={handleLogin}>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Typography
              variant='h1'
              sx={{ textAlign: 'center' }}
              className='oleo-title'
            >
              Login
            </Typography>
          </Grid>
          <Grid size={12}>
            <WhiteTextField
              value={username}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setUsername(event.target.value);
              }}
              fullWidth
              placeholder='Username'
              type='text'
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position='start' className="text-white">
                      <PersonIcon sx={{ color: '#fff' }} />
                    </InputAdornment>
                  )
                }
              }}
            />
          </Grid>
          <Grid size={12}>
            <WhiteTextField
              fullWidth
              value={password}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setPassword(event.target.value);
              }}
              placeholder='Password'
              type={showPassword ? 'text' : 'password'}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position='start' className="text-white">
                      <KeyIcon sx={{ color: '#fff' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? (
                        <VisibilityOffIcon sx={{ color: '#fff' }} />
                      ) : (
                        <VisibilityIcon sx={{ color: '#fff' }} />
                      )}
                    </IconButton>
                  )
                }
              }}
            />
          </Grid>
          <Grid size={12}>
            <SubmitButton fullWidth={true} variant='contained' styles='bg-bittersweet' isLoading={loading} btnText='Sign In' icon={<LoginIcon />} className='btn-bittersweet' />
          </Grid>
          <Grid size={12} sx={{ display: 'grid', placeItems: 'center'}}>
            <Button sx={{ color: '#ffffff', textDecoration: 'underline'}} LinkComponent={Link} href='/auth/reset-password'>Forgot password?</Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  )
}

export default LoginForm
