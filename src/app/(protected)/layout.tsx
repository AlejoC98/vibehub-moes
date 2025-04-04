'use client'
import { Box, useMediaQuery, useTheme } from '@mui/material'
import React, { ReactNode, useContext, useEffect, useState } from 'react'
import GlobalProvider, { GlobalContext } from '../../../utils/context/global_provider'
import SideBar from '../../../components/layout/sidebar'
import Navbar from '../../../components/layout/navbar'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import DrawerMenu from '../../../components/layout/drawer_menu'

const layout = ({ children} : {children: ReactNode}) => {

  const { isLaunching } = useContext(GlobalContext);

  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  const toggleDrawer = (newOpen: boolean) => {
    setOpenDrawer(newOpen);
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

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
        { isMobile ? (<DrawerMenu openDrawer={openDrawer} toggleDrawer={toggleDrawer} />) : (<SideBar open={openMenu} setOpen={setOpenMenu} />) }
        <Box sx={{display: 'flex', flexDirection: 'column', width: isMobile ? '100%' : `calc(100% - ${openMenu? 250 : 50}px)`, height: '100vh', overflowY: 'scroll', overflowX: 'hidden'}}>
            <Navbar open={openMenu} setOpen={ isMobile ? setOpenDrawer : setOpenMenu} />
            <Box sx={{height: '100%', padding: '10px 25px'}}>
            { children }
            </Box>
        </Box>
    </Box>
    </GlobalProvider>
  )
}

export default layout
