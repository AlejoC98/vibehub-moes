import { Box, Typography, useMediaQuery } from '@mui/material'
import React, { ReactNode, useContext } from 'react'
import { Block } from '../../style/global';
import Grid from '@mui/material/Grid2';

const Metrics = ({ color = '#333', title, icon, content, footer } : { color?: string, title?: string, icon?: ReactNode, content?: any, footer?: string }) => {

    const reponse = useMediaQuery('(min-width:600px)');

    return (
        <Block sx={{ backgroundColor: color, color: '#ffffff'}}>
            <Grid container spacing={2} className="h-full">
                <Grid size={12}>
                    <Box className="flex h-full w-full justify-center items-center">
                        <Typography variant='h6'>{ title }</Typography>
                    </Box>
                </Grid>
                <Grid size={6}>
                    <Box className="flex justify-center">
                        <Typography variant='h4'>{ content }</Typography>
                    </Box>
                </Grid>
                <Grid size={6}>
                    <Box className="flex h-full w-full justify-center items-center">
                        { icon }
                    </Box>
                </Grid>
                <Grid size={12}>
                    <Box>
                        { footer }
                    </Box>
                </Grid>
            </Grid>
        </Block>
    )
}

export default Metrics