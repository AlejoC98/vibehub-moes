'use client'
import { Box, Button, Dialog, DialogTitle, IconButton, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import React, { cloneElement, ReactElement, ReactNode, useState } from 'react'
import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';
import { useRouter } from 'next/navigation';

interface ActionButtonsContent {
    text?: string,
    color?: string,
    form: ReactElement<any>,
    data?: any,
}

const Details = ({ 
    children,
    title,
    actionButtons,
    // editForm,
    // actionButton,
    // actionButtonColor,
    modalTitle
}: { 
    children: ReactNode,
    title: string,
    actionButtons: ActionButtonsContent[]
    // actionButton?: string,
    // actionButtonColor?: string,
    // editForm: ReactElement<any>,
    modalTitle?: string
}) => {

    const router = useRouter();
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [activeFrom, setActiveForm] = useState<ReactElement<any>>(<></>);
    const [activeDefaultData, setActiveDefaultData] = useState<ReactElement<any>>();

    const handleOpen = (option: string) => {
        const modalForm = actionButtons.find(b => b.text == option);
        if (modalForm != null) {
            setActiveForm(modalForm.form);
            setActiveDefaultData(modalForm.data);
            setOpenModal(true);
        }
    }

    const handleClose = () => {
        setOpenModal(false);
    };

    return (
        <Box>
            <Grid container spacing={2}>
                <Grid size={{ xl: 3, lg: 3, md: 2, sm: 2, xs: 2}}>
                    <IconButton onClick={() => router.back()}>
                        <ArrowBackTwoToneIcon sx={{ color: '#FFFFFF'}} />
                    </IconButton>
                </Grid>
                <Grid size={{ xl: 6, lg: 6, md: 6, sm: 6, xs: 6}}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', placeItems: 'center'}}>
                        <Typography variant='h5' fontWeight='bold' sx={{ color: "#FFFFFF"}}>{title}</Typography>
                    </Box>
                </Grid>
                <Grid size={{ xl: 3, lg: 3, md: 4, sm: 4, xs: 4}}>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'end'}}>
                    { actionButtons.map((button, index) => (
                        <Button key={index} sx={{ background: button.color }} variant='contained' onClick={() => handleOpen(button.text!)}>{ button.text }</Button>
                    ))}        
                    </Box>
                </Grid>
                {children}
            </Grid>
            <Dialog onClose={handleClose} open={openModal} fullWidth>
                <DialogTitle>
                    <Typography sx={{ fontSize: 25 }} fontWeight='bold'>{modalTitle}</Typography>
                </DialogTitle>
                {cloneElement(activeFrom, { defaultData: activeDefaultData || [], setOpenModal: setOpenModal })}
            </Dialog>
        </Box>
    )
}

export default Details
