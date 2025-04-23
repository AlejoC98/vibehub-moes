'use client'
import React, { useContext, useEffect } from 'react'
import { GlobalContext } from '@/utils/context/global_provider'
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2'
import Block from '@/components/block';
import TicketForm from '@/components/forms/ticket_forms';
import CustomAccordionSummary from '@/components/custom_accordion_summary';

const HelpCenter = () => {

    const { setIsLaunching } = useContext(GlobalContext);

    const faqs = [
        {
          question: "Can I add multiple users or employees?",
          answer: "Yes, you can invite team members and assign them roles such as Admin, Picker, or Receiver, each with custom permissions."
        },
        {
          question: "How do I assign roles or permissions?",
          answer: "Go to Users, then select a user to assign them a predefined role. Also remember that at the moment of creating a user you can also assign the roles there."
        },
        {
          question: "How do I process an outbound shipment?",
          answer: "First, create a new outbound shipment order from the Shipments section. Once it's created, click the eye icon to view the order details. From there, you can start adding a Picking List by selecting the products and specifying the quantities to be picked. After completing the picking process, you can finalize and dispatch the shipment."
        },
        {
          question: "Is my data secure?",
          answer: "We use encryption and secure data storage protocols. Your data is backed up regularly and access is restricted based on role permissions."
        }
      ];

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
                            <CustomAccordionSummary panels={faqs} />
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