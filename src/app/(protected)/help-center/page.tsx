'use client'
import React, { useContext, useEffect } from 'react'
import { GlobalContext } from '../../../../utils/context/global_provider'
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Box, Button, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2'
import { Block } from '../../../../style/global';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TicketForm from '../../../../components/forms/ticket_forms';

const HelpCenter = () => {

    const { setIsLaunching } = useContext(GlobalContext);

    useEffect(() => {
        setIsLaunching(false);
    }, []);

    return (
        <Box>
            <Grid container spacing={5}>
                <Grid size={12}>
                    <Block sx={{ display: 'flex', flexDirection: 'column', gap: 2}}>
                        <Typography variant='h3' textAlign='center'>FAQs</Typography>
                        <Typography textAlign='center'>Require assistance? Here are some of our commonly asked questions!</Typography>
                        <Typography textAlign='center' sx={{ fontSize: 12, color: '#6e829f'}}>Discover answers to common queries and find solutions to your concerns with our comprehensive list of frequently asked questions.</Typography>
                        <Box sx={{ paddingLeft: { xl: '6rem', lg: '6rem', md: 0, sm: 0, xs: 0}, paddingRight: { xl: '6rem', lg: '6rem', md: 0, sm: 0, xs: 0}}}>
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1-content"
                                    id="panel1-header"
                                >
                                    <Typography component="span">Accordion 1</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                                    malesuada lacus ex, sit amet blandit leo lobortis eget.
                                </AccordionDetails>
                            </Accordion>
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel2-content"
                                    id="panel2-header"
                                >
                                    <Typography component="span">Accordion 2</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                                    malesuada lacus ex, sit amet blandit leo lobortis eget.
                                </AccordionDetails>
                            </Accordion>
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel2-content"
                                    id="panel2-header"
                                >
                                    <Typography component="span">Accordion 3</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                                    malesuada lacus ex, sit amet blandit leo lobortis eget.
                                </AccordionDetails>
                            </Accordion>
                        </Box>
                        <Box sx={{ maxWidth: 800, padding: { xl: '2rem 4rem', lg: '2rem 4rem', md: '2rem 1rem', sm: '2rem 1rem', xs: '2rem 1rem'}, margin: '0 auto', background: '#f9f9fa'}}>
                            <TicketForm />
                        </Box>
                    </Block>
                </Grid>
            </Grid>
        </Box>
    )
}

export default HelpCenter