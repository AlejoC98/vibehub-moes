'use client'
import { Box } from '@mui/material'
import React, { ReactNode, useState } from 'react'
import GlobalProvider from '../../../utils/context/global_provider'
import SideBar from '../../../components/layout/sidebar'
import Navbar from '../../../components/layout/navbar'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const layout = ({ children} : {children: ReactNode}) => {
  const [openMenu, setOpenMenu] = useState<boolean>(false);
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
        <SideBar open={openMenu} setOpen={setOpenMenu} />
        <Box sx={{display: 'flex', flexDirection: 'column', width: `calc(100% - ${openMenu? 250 : 50}px)`, height: '100vh', overflowY: 'scroll', overflowX: 'hidden'}}>
            <Navbar open={openMenu} setOpen={setOpenMenu} />
            <Box sx={{height: '100%', padding: '10px 25px'}}>
            { children }
            </Box>
        </Box>
    </Box>
    </GlobalProvider>
  )
}

export default layout
