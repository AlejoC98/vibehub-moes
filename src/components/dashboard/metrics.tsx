import { Box, Typography, useMediaQuery } from '@mui/material'
import React, { ReactNode, useContext } from 'react'
import Block from '@/components/block';

const Metrics = ({ color = '#333', title, icon, content, footer } : { color?: string, title?: string, icon?: ReactNode, content?: any, footer?: string }) => {

    const reponse = useMediaQuery('(min-width:600px)');

    return (
        <Block sx={{ backgroundColor: color, color: '#ffffff', display: 'flex', justifyContent: 'space-between', placeItems: 'center', position: 'relative'}}>
            <Box>
            <Typography variant='h6'>{ title }</Typography>
            <Typography variant='h5'>{ content }</Typography>
            </Box>
            <Box>{ icon }</Box>
        </Block>
    )
}

export default Metrics