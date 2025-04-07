'use client'
import { Avatar, Box, Chip, List, ListItem, ListItemText, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { GlobalContext } from '../../../../utils/context/global_provider';
import Grid from '@mui/material/Grid2'
import { Block } from '../../../../style/global';
import { HugeiconsIcon } from '@hugeicons/react';
import { Building03Icon, Location01Icon } from '@hugeicons/core-free-icons';
import UpgradePlan from '../../../../components/upgrade_plan';
import { createClient } from '../../../../utils/supabase/client';
import { toast } from 'react-toastify';
import SubmitButton from '../../../../components/submit_button';

const Profile = () => {

  const supabase = createClient();
  const { setIsLaunching, userAccount } = useContext(GlobalContext);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSendResetPasswordRequest = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.resetPasswordForEmail(userAccount?.email!, {
        redirectTo: process.env.NEXT_PUBLIC_RESET_PASSWORD_URL!,
      });

      if (error) {
        throw new Error(error.message);
      }

      toast.success('Email send, Please check your email.');
    } catch (error: any) {
      toast.warning(error.message);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    setIsLaunching(false);
  }, []);

  return (
    <Box sx={{ paddingBottom: 10 }}>
      <Grid container spacing={5}>
        <Grid size={12} sx={{ position: 'relative' }} id="grid-parent">
          <Block sx={{ minHeight: '90vh' }} id="block-parent">
            <Box sx={{ background: '#333', width: '100%', height: 200 }}>
              <img
                src="/static/img/profile-bg.jpg"
                alt=""
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            </Box>
            <Grid container spacing={{ xl: 5, lg: 5, md: 10, sm: 10, xs: 10 }} sx={{ padding: '0 2rem', mt: '-50px' }}>
              <Grid size={{ xl: 3, lg: 12, md: 12, sm: 12, xs: 12 }}>
                <Block>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      placeItems: 'center',
                      gap: 2,
                      marginBottom: 2
                    }}
                  >
                    <Avatar
                      alt={`${userAccount?.first_name} ${userAccount?.last_name}`}
                      src="/static/images/avatar/1.jpg"
                      sx={{ width: 120, height: 120 }}
                    />
                    <Box
                      sx={{
                        display: 'flex',
                        placeItems: 'center',
                        justifyContent: 'center',
                        gap: {
                          xl: 5,
                          lg: 5,
                          md: 5,
                          sm: 1,
                          xs: 1
                        },
                        flexDirection: {
                          xl: 'row',
                          lg: 'row',
                          md: 'row',
                          sm: 'column',
                          xs: 'column'
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          placeItems: 'center',
                          gap: 1,
                          justifyContent: 'center',
                        }}
                      >
                        <HugeiconsIcon size={15} icon={Building03Icon} />
                        <Typography sx={{ fontSize: 14 }}>
                          {userAccount?.locations.name}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          placeItems: 'center',
                          gap: 1,
                          justifyContent: 'center',
                        }}
                      >
                        <HugeiconsIcon size={15} icon={Location01Icon} />
                        <Typography sx={{ fontSize: 14 }}>
                          {userAccount?.locations.city} {userAccount?.locations.state}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                      {userAccount?.accounts_roles?.map((r) => (
                        <Chip key={r.id} label={r.roles.name || ''} />
                      ))}
                    </Box>
                  </Box>
                  <Typography variant="h6" fontWeight="bold">
                    Basic Info:
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Name"
                        secondary={`${userAccount?.first_name} ${userAccount?.last_name}`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Email" secondary={userAccount?.email} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Username" secondary={userAccount?.username} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Phone" secondary={userAccount?.phone} />
                    </ListItem>
                    <ListItem>
                      <SubmitButton
                        isLoading={isLoading}
                        btnText='Reset Password'
                        className='btn-munsell'
                        onClick={handleSendResetPasswordRequest}
                      />
                    </ListItem>
                  </List>
                </Block>
              </Grid>
              <Grid size={{ xl: 9, lg: 12, md: 12, sm: 12, xs: 12 }} sx={{ display: { xl: 'block', lg: 'block', md: 'block', sm: 'none', xs: 'none' } }}>
                <UpgradePlan />
              </Grid>
            </Grid>
          </Block>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Profile
