'use client'
import React, { ReactNode, useContext, useEffect } from 'react'
import { GlobalContext } from '../../../utils/context/global_provider'
import { Box } from '@mui/material';
import { HashLoader } from 'react-spinners';

const LoadingWrapper = ({ children }: { children: ReactNode }) => {

    const { isLaunching, setIsLaunching } = useContext(GlobalContext);

    useEffect(() => {
        setTimeout(() => {
          setIsLaunching(false);
        }, 3000);
      }, [])

  return (
    <>
    { isLaunching && (
          <Box sx={{ position: 'absolute', zIndex: 100, top: 0, bottom: 0, left: 0, right: 0, display: 'grid', placeItems: 'center', background: 'rgba(29, 38, 51, 1)'}}>
            <HashLoader color='#FFE900' size={80} />
          </Box>
        ) }
        { children }
    </>
  )
}

export default LoadingWrapper
