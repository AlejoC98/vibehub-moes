import { Box, Button, Dialog, DialogTitle, IconButton, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import React, { cloneElement, ReactElement, ReactNode, useState } from 'react'
import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';
import { useRouter } from 'next/navigation';

const Details = ({ content, editForm, data }: { content: ReactNode, editForm: ReactElement<any>, data?: any }) => {

    const [openModal, setOpenModal] = useState<boolean>(false);
    const router = useRouter();

    const handleClose = () => {
        setOpenModal(false);
    };

  return (
    <Box>
    {content && (
        <Grid container spacing={2}>
            <Grid size={1}>
                <Box className="w-10">
                    <IconButton onClick={() => router.back()}>
                        <ArrowBackTwoToneIcon />
                    </IconButton>
                </Box>
            </Grid>
            <Grid size={11}>
                <Box className="flex w-full justify-end">
                    <Button variant='contained' className="bg-red-950"  onClick={() => setOpenModal(true)}>Edit</Button>
                </Box>
            </Grid>
            { content }
        </Grid>
    )}
    <Dialog onClose={handleClose} open={openModal} fullWidth>
<DialogTitle>
  <Typography variant='h4' className='text-center'>Edit</Typography>
</DialogTitle>
{cloneElement(editForm, { defaultData: data, setOpenModal: setOpenModal })}
</Dialog>
</Box>
  )
}

export default Details
