'use client'
import { Box, Typography } from '@mui/material'
import React, { useContext } from 'react'
import Grid from '@mui/material/Grid2';
import { Block } from '../../../../style/global';
import BasicTable from '../../../../components/tables/basic_table';
import ShippingForm from '../../../../components/forms/shipping_form';
import { GlobalContext } from '../../../../utils/context/global_provider';
import { GridColDef } from '@mui/x-data-grid';

const Shipping = () => {

  const { shippings } = useContext(GlobalContext);

  const shippingColumns: GridColDef[] = [
      { field: 'id', headerName: 'ID' },
      { field: 'pl_number', headerName: 'PL #' },
      { field: 'bol_number', headerName: 'BOL #' },
      { field: 'carrier', headerName: 'Carrier' },
      { field: 'trailer_number', headerName: 'Trailer #' },
      { field: 'picker_name', headerName: 'Picker' },
      { field: 'verified_by', headerName: 'Verified By' },
      { field: 'shipped_quantity', headerName: 'Shipped Quantity' },
      { field: 'status', headerName: 'Status', renderCell: (params) => {
        switch (params.row.status) {
          case 'Pending':
            return <Box sx={{color: "#FFFFFF", height: '100%', display: 'grid', placeItems: 'center'}}>
              <Typography sx={{ background: '#FFE082', padding: '.5px 2px', borderRadius: 1 }}>{params.row.status}</Typography>
            </Box>;
          case 'Processing':
            return <Box sx={{color: "#FFFFFF", height: '100%', display: 'grid', placeItems: 'center'}}>
              <Typography sx={{ background: '#64B5F6', padding: '.5px 2px', borderRadius: 1 }}>{params.row.status}</Typography>
            </Box>;
          case 'Shipped':
            return <Box sx={{color: "#FFFFFF", height: '100%', display: 'grid', placeItems: 'center'}}>
              <Typography sx={{ background: '#242f40', padding: '.5px 2px', borderRadius: 1 }}>{params.row.status}</Typography>
            </Box>;
          case 'Delivered':
            return <Box sx={{color: "#FFFFFF", height: '100%', display: 'grid', placeItems: 'center'}}>
              <Typography sx={{ background: '#81C784', padding: '.5px 2px', borderRadius: 1 }}>{params.row.status}</Typography>
            </Box>;
          case 'Cancelled':
            return <Box sx={{color: "#FFFFFF", height: '100%', display: 'grid', placeItems: 'center'}}>
              <Typography sx={{ background: '#E57373', padding: '.5px 2px', borderRadius: 1 }}>{params.row.status}</Typography>
            </Box>;
          default:
            return <Box sx={{or: "#FFFFFF", height: '100%', display: 'grid', placeItems: 'center'}}>
              <Typography sx={{ background: '#EEE', padding: '.5px 2px', borderRadius: 1 }}>{params.row.status}</Typography>
            </Box>;
        }
      }}
    ];

  return (
    <Box>
        <Grid container spacing={5}>
            <Grid size={12}>
                <Block>
                    <BasicTable title='Shipping Records' data={shippings || []} columns={shippingColumns} createForm={<ShippingForm />} createFormTitle='Create Shipping Record' />
                </Block>
            </Grid>
        </Grid>
    </Box>
  )
}

export default Shipping
