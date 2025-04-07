'use client'
import { Box, Typography } from '@mui/material'
import React, { useContext, useEffect } from 'react'
import Grid from '@mui/material/Grid2';
import { Block } from '@/style/global';
import BasicTable from '@/components/tables/basic_table';
import { GlobalContext } from '@/utils/context/global_provider';
import { GridColDef } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import ShippingForm from '@/components/forms/shipping_form';

const Shipping = () => {

  const { shippings, setIsLaunching } = useContext(GlobalContext);

  const shippingColumns: GridColDef[] = [
      { field: 'carrier', headerName: 'Carrier' },
      { field: 'trailer_number', headerName: 'Trailer #' },
      { field: 'created_at', headerName: 'Created At', renderCell: (params) => {
        return dayjs(params.row.created_at).format('ddd MMM DD YYYY hh:mm A');
      }},
      { field: 'shipped_out_at', headerName: 'Shipped Out', renderCell: (params) => {
        return dayjs(params.row.shipped_out_at).format('ddd MMM DD YYYY hh:mm A');
      }},
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

  useEffect(() => {
    setIsLaunching(false);
  }, []);

  return (
    <Box>
        <Grid container spacing={5}>
            <Grid size={12}>
                <Block>
                    <BasicTable title='Shipping Orders' data={shippings || []} columns={shippingColumns} createForm={<ShippingForm />} createFormTitle='Create Shipping Order' created_column={true} />
                </Block>
            </Grid>
        </Grid>
    </Box>
  )
}

export default Shipping
