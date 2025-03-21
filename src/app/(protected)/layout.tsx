import { Box } from '@mui/material'
import React, { ReactNode } from 'react'

const layout = ({ children} : {children: ReactNode}) => {
  return (
    <Box className='bg-dash' sx={{ overflow: 'hidden'}}>
        { children }
    </Box>
  )
}

export default layout
