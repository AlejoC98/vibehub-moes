import { Box } from '@mui/material'
import React from 'react'
import Grid from '@mui/material/Grid2';
import { Block } from '../../../../style/global';
import BasicTable from '../../../../components/tables/basic_table';
import ShippingForm from '../../../../components/forms/shipping_form';

const Shipping = () => {
  return (
    <Box>
        <Grid container spacing={5}>
            <Grid size={12}>
                <Block>
                    <BasicTable title='Shipping Records' data={[]} columns={[]} createForm={<ShippingForm />} createFormTitle='Create Shipping Record' />
                </Block>
            </Grid>
        </Grid>
    </Box>
  )
}

export default Shipping
