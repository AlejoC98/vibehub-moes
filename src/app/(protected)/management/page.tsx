'use client';
import { GlobalContext } from '@/utils/context/global_provider';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import React, { useContext, useEffect } from 'react'
import Grid from '@mui/material/Grid2';
import Block from '@/components/block';
import UpdatesReportsList from '@/components/updates_reports_list';
import UpdateReportForm from '@/components/forms/update_report_form';

const Management = () => {

    const { setIsLaunching } = useContext(GlobalContext);

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        setIsLaunching(false);
    }, []);
    return (
        <Box>
            <Grid container spacing={5}>
                <Grid size={4}>
                    <Block>
                        <Typography>Report Updates</Typography>
                        <Button onClick={handleClickOpen}>Create new Report</Button>
                        <UpdatesReportsList />
                    </Block>
                </Grid>
                <Grid size={4}>
                    <Block>
                        <Typography>Report Updates</Typography>
                    </Block>
                </Grid>
                <Grid size={4}>
                    <Block>
                        <Typography>Report Updates</Typography>
                    </Block>
                </Grid>
            </Grid>
            <Dialog
                open={open}
                maxWidth='md'
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Use Google's location service?"}
                </DialogTitle>
                <DialogContent>
                    <UpdateReportForm />
                </DialogContent>
                {/* <DialogActions>
                    <Button onClick={handleClose}>Disagree</Button>
                    <Button onClick={handleClose} autoFocus>
                        Agree
                    </Button>
                </DialogActions> */}
            </Dialog>
        </Box>
    )
}

export default Management
