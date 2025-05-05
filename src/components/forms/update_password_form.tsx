import { Box, IconButton, InputAdornment, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import Grid from '@mui/material/Grid2';
import { WhiteTextField } from '@/style/global';
import SubmitButton from '../submit_button';
import { createClient } from '@/utils/supabase/client';
import { SubmitHandler, useForm } from 'react-hook-form';
import KeyIcon from '@mui/icons-material/Key';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { startCountdown } from '@/utils/functions/main';

interface UpdatePasswordInput {
  password: string;
  confirm_password: string;
}

const UpdatePasswordForm = () => {

  const supabase = createClient();
  const router = useRouter();
  const ref = useRef<HTMLElement>(null);


  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UpdatePasswordInput>({});

  const password = watch('password');

  const rules = [
    { label: 'One uppercase letter', isValid: /[A-Z]/.test(password) },
    { label: 'One lowercase letter', isValid: /[a-z]/.test(password) },
    { label: 'One number', isValid: /[0-9]/.test(password) },
    { label: 'One special character', isValid: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
    { label: 'At least 8 characters', isValid: password?.length >= 8 },
  ]

  const [showRules, setShowRules] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const loadUserSession = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setTimeout(() => {
        router.replace('/auth/login');
      }, 1000);
    } else {
      setIsSessionActive(true);
    }
  }

  const validateStrongPassword = (value: string) => {
    const hasUpper = /[A-Z]/.test(value)
    const hasLower = /[a-z]/.test(value)
    const hasNumber = /[0-9]/.test(value)
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value)
    const isLongEnough = value.length >= 8

    if (!hasUpper) return 'Must include at least one uppercase letter'
    if (!hasLower) return 'Must include at least one lowercase letter'
    if (!hasNumber) return 'Must include at least one number'
    if (!hasSpecial) return 'Must include at least one special character'
    if (!isLongEnough) return 'Must be at least 8 characters long'

    return true
  }

  const handleUpdatePassword: SubmitHandler<UpdatePasswordInput> = async (formData) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: formData.password
      });

      if (error) {
        throw new Error(error.message);
      }

      toast.success('Password successfully updated!');
      setIsLoading(false);
      setIsRedirecting(true);
      startCountdown(ref, () => router.replace('/auth/login'), 3, 'Redirectin in ');

    } catch (error: any) {
      console.log(error.message);
      toast.warning("Error updating password.");
      setIsRedirecting(false);
    }
  }

  useEffect(() => {
    loadUserSession();
  }, []);

  return (
    <Box sx={{ flexGrow: 1, padding: 5 }}>

      {isSessionActive ? (
        <form onSubmit={handleSubmit(handleUpdatePassword)}>
          <Grid container spacing={5}>
            <Grid size={12}>
              <Typography sx={{ color: '#FFF' }} variant='h4' textAlign={'center'}>Reset Password</Typography>
            </Grid>
            <Grid size={12}>
              <WhiteTextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                onFocus={() => setShowRules(true)}
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
                label="New Password"
                {...register('password', {
                  required: 'Password is required!',
                  validate: validateStrongPassword
                })}
                onBlur={() => setShowRules(false)}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
              <Box
                sx={{
                  mt: 1,
                  borderRadius: 2,
                  overflow: 'hidden',
                  padding: showRules ? 2 : 0,
                  transition: 'all 0.4s ease',
                  maxHeight: showRules ? 300 : 0,
                  border: showRules ? '1px solid #ccc' : 'none',
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                }}
              >
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Password must include:
                </Typography>
                {rules.map((rule, i) => (
                  <Typography
                    key={i}
                    sx={{
                      color: rule.isValid ? 'green' : 'red',
                      fontSize: 14,
                    }}
                  >
                    • {rule.label}
                  </Typography>
                ))}
              </Box>

            </Grid>
            <Grid size={12}>
              <WhiteTextField
                fullWidth
                label="Repeat Password"
                type={showConfirm ? 'text' : 'password'}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position='start' className="text-white">
                        <KeyIcon sx={{ color: '#fff' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <IconButton onClick={() => setShowConfirm(!showConfirm)}>
                        {showConfirm ? (
                          <VisibilityOffIcon sx={{ color: '#fff' }} />
                        ) : (
                          <VisibilityIcon sx={{ color: '#fff' }} />
                        )}
                      </IconButton>
                    )
                  }
                }}
                {...register('confirm_password', { required: 'Confirm password is require!', validate: (value) => value === password || 'Password do not macth' })}
                error={!!errors.confirm_password}
                helperText={errors.confirm_password?.message}
              />
            </Grid>
            <Grid size={12}>
              {isRedirecting ? (
                <Typography sx={{ color: '#FFF' }} textAlign='center' ref={ref} />
              ) : (
                <SubmitButton
                  fullWidth={true}
                  btnText='Update Password'
                  isLoading={isLoading}
                  className='btn-bittersweet'
                />
              )}
            </Grid>
          </Grid>
        </form>
      ) : (
        <Box>
          <Typography variant='h4' sx={{ color: '#fff' }}>Link Expired</Typography>
        </Box>
      )}
    </Box>
  )
}

export default UpdatePasswordForm
