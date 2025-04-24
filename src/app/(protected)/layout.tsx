'use client'
import { Box, useMediaQuery, useTheme } from '@mui/material'
import React, { ReactNode, useEffect, useState } from 'react'
import GlobalProvider from '@/utils/context/global_provider'
import SideBar from '@/components/layout/sidebar'
import Navbar from '@/components/layout/navbar'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import DrawerMenu from '@/components/layout/drawer_menu'
import LoadingWrapper from './loading_wrapper'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

const layout = ({ children }: { children: ReactNode }) => {

  const supabase = createClient();
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<number | null>(1);

  const toggleDrawer = (newOpen: boolean) => {
    setOpenDrawer(newOpen);
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <GlobalProvider>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        theme="light"
      />
      <Box className='bg-dash'>
        <LoadingWrapper>
          {isMobile ? (<DrawerMenu openDrawer={openDrawer} toggleDrawer={toggleDrawer} />) : (<SideBar open={openMenu} setOpen={setOpenMenu} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />)}
          <Box
            sx={{
              display: 'flex',
              position: 'relative',
              flexDirection: 'column',
              width: isMobile ? '100%' : `calc(100% - ${openMenu ? 250 : 50}px)`,
            }}
          >
            <Box className='bg-gunmetal-dark' sx={{width: '100%', height: isMobile ? 150 : 225, position: 'absolute', zIndex: 0}}>
              <Navbar open={openMenu} setOpen={isMobile ? setOpenDrawer : setOpenMenu} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
            </Box>
            <Box sx={{ position: 'relative', top: isMobile ? 90 : 130, overflowY: 'auto', height: '80%', padding: '0 25px 50px 25px'}} >
              {children}
            </Box>
          </Box>
        </LoadingWrapper>
      </Box>
    </GlobalProvider>
  )
}

export default layout
