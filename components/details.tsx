'use client'
import { Box, Button, Dialog, DialogTitle, IconButton, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import React, { cloneElement, ReactElement, ReactNode, useState } from 'react'
import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';
import { useRouter } from 'next/navigation';

const Details = ({ children, title, editForm, data, actionButton, actionButtonColor, modalTitle }: { children: ReactNode, title: string, editForm: ReactElement<any>, data?: any, actionButton?: string, actionButtonColor?: string, modalTitle?: string }) => {

    const [openModal, setOpenModal] = useState<boolean>(false);
    const router = useRouter();

    const handleClose = () => {
        setOpenModal(false);
    };

    return (
        <Box>
            <Grid container spacing={2}>
                <Grid size={{ xl: 3, lg: 3, md: 2, sm: 2, xs: 2}}>
                    <IconButton onClick={() => router.back()}>
                        <ArrowBackTwoToneIcon />
                    </IconButton>
                </Grid>
                <Grid size={{ xl: 6, lg: 6, md: 6, sm: 6, xs: 6}}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', placeItems: 'center'}}>
                        <Typography variant='h5' fontWeight='bold'>{title}</Typography>
                    </Box>
                </Grid>
                <Grid size={{ xl: 3, lg: 3, md: 4, sm: 4, xs: 4}}>
                    {actionButton != undefined && (
                        <Button sx={{ background: actionButtonColor }} variant='contained' onClick={() => setOpenModal(true)}>{actionButton}</Button>
                    )}
                </Grid>
                {children}
            </Grid>
            <Dialog onClose={handleClose} open={openModal} fullWidth>
                <DialogTitle>
                    <Typography sx={{ fontSize: 25 }} fontWeight='bold'>{modalTitle}</Typography>
                </DialogTitle>
                {cloneElement(editForm, { defaultData: data, setOpenModal: setOpenModal })}
            </Dialog>
        </Box>
    )
}

export default Details
