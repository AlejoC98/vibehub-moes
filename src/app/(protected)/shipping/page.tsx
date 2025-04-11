'use client'
import { Box, Typography } from '@mui/material'
import React, { useContext, useEffect } from 'react'
import Grid from '@mui/material/Grid2';
import { Block } from '@/style/global';
import BasicTable from '@/components/tables/basic_table';
import { GlobalContext } from '@/utils/context/global_provider';
import { GridColDef } from '@mui/x-data-grid';
import { convertTimeByTimeZone } from '@/utils/functions/main';
import OldShippingForm from '@/components/forms/old_shipping_form';

const Shipping = () => {

  const { shippings, userAccount, setIsLaunching } = useContext(GlobalContext);

  const shippingColumns: GridColDef[] = [
      { field: 'carrier', headerName: 'Carrier' },
      { field: 'trailer_number', headerName: 'Trailer #' },
      { field: 'created_at', headerName: 'Created At', renderCell: (params) => {
        return convertTimeByTimeZone(userAccount?.sessionTimeZone!, params.row.created_at);
      }},
      { field: 'closed_at', headerName: 'Shipped Out', renderCell: (params) => {
        return convertTimeByTimeZone(userAccount?.sessionTimeZone!, params.row.closed_at);
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
                    <BasicTable title='Shipping Orders' data={shippings || []} columns={shippingColumns} createForm={<OldShippingForm />} createFormTitle='Create Shipping Order' created_column={true} source='shippings_orders' />
                </Block>
            </Grid>
        </Grid>
    </Box>
  )
}

export default Shipping
