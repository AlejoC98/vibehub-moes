import { Box, Button, Typography } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const NotFound = () => {
  return (
    <Box className='bg-dash' sx={{ display: 'grid', placeItems: 'center'}}>
        <Box sx={{ background: 'rgba(255, 255, 255, .7)', borderRadius: 5, padding: 5, display: 'flex', flexDirection: 'column', justifyContent: 'center', placeItems: 'center', gap: 10}}>
            <img src="/static/img/404-page.png" alt=""  width={700} height={500}/>
            <Box>
                <Button LinkComponent={Link} href='/dashboard' sx={{ background: '#f9564f'}} variant='contained'>Back to Home</Button>
            </Box>
        </Box>
    </Box>
  )
}

export default NotFound
