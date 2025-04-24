import { Box, Typography, useMediaQuery } from '@mui/material'
import React, { ReactNode, useContext } from 'react'
import Block from '@/components/block'

const Metrics = ({ color = '#333',
    title,
    icon,
    content,
    footer,
    inAnimation = 'animate__fadeInUp',
    inAnimationDelay = null,
} : {
    color?: string,
    title?: string,
    icon?: ReactNode,
    content?: any,
    footer?: string,
    inAnimation?: string,
    inAnimationDelay?: null | string,
}) => {
    const reponse = useMediaQuery('(min-width:600px)');

    return (
        <Block className={`animate__animated ${inAnimation}`} sx={{
            backgroundColor: color,
            color: '#ffffff',
            display: 'flex',
            justifyContent: 'space-between',
            placeItems: 'center',
            height: 100,
            maxWidth: 350,
            margin: "0 auto",
            position: 'relative',
            '--animate-duration': inAnimationDelay,
            }}
        >
            <Box>
            <Typography variant='h6' fontWeight='bold' sx={{ color: '#000000'}}>{ title }</Typography>
            <Typography variant='h5' sx={{ color: '#000000'}}>{ content }</Typography>
            </Box>
            <Box>{ icon }</Box>
        </Block>
    )
}

export default Metrics