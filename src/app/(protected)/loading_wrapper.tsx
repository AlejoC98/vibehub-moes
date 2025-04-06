'use client'
import React, { ReactNode, useContext, useEffect } from 'react'
import { GlobalContext } from '../../../utils/context/global_provider'
import { Box } from '@mui/material';
import { HashLoader } from 'react-spinners';

const LoadingWrapper = ({ children }: { children: ReactNode }) => {

  const { isLaunching } = useContext(GlobalContext);

  return (
    <>
      <Box
        className={`animate__animated ${isLaunching ? 'animate__fadeIn animate__faster' : 'animate__fadeOut'}`}
        sx={{
          position: 'absolute',
          zIndex: 100,
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          display: isLaunching ? 'grid' : 'none',
          placeItems: 'center',
          transition: 'display 1s ease-in-out',
          background: 'rgba(29, 38, 51, .9)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)'
        }}
      >
        <HashLoader color='#FFE900' size={80} />
      </Box>
      {children}
    </>
  )
}

export default LoadingWrapper