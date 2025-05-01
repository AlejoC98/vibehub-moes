'use client'
import { Box, Typography } from '@mui/material'
import React, { useContext, useEffect } from 'react'
import Grid from '@mui/material/Grid2';
import Block from '@/components/block';
import BasicTable from '@/components/tables/basic_table';
import { GlobalContext } from '@/utils/context/global_provider';
import { GridColDef } from '@mui/x-data-grid';
import { convertTimeByTimeZone } from '@/utils/functions/main';
import ShippingForm from '@/components/forms/shipping/shipping_form';
import StatusBadge from '@/components/status_badge';

const Shipping = () => {

  const { shippings, userAccount, setIsLaunching } = useContext(GlobalContext);

  const shippingColumns: GridColDef[] = [
      { field: 'carrier', headerName: 'Carrier', width: 100},
      { field: 'trailer_number', headerName: 'Trailer #' },
      { field: 'total_shipped', headerName: 'Total Shipped', width: 110},
      { field: 'shippings_pick_list', headerName: 'Total Pick Lists', renderCell: (params) => {
        return params.row.shippings_pick_list.length;
      }, width: 120},
      { field: 'created_at', headerName: 'Created At', renderCell: (params) => {
        return convertTimeByTimeZone(userAccount?.sessionTimeZone!, params.row.created_at);
      }, width: 180},
      { field: 'closed_at', headerName: 'Closed At', renderCell: (params) => {
        if (params.row.closed_at != null) {
          return convertTimeByTimeZone(userAccount?.sessionTimeZone!, params.row.closed_at);
        } else {
          return params.row.closed_at;
        }
      }, width: 180, editable: false},
      { field: 'status', headerName: 'Status', renderCell: (params) => {
        return <StatusBadge status={params.row.status} />
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
                    <BasicTable title='Shipping Orders' data={shippings || []} columns={shippingColumns} createForm={<ShippingForm />} createFormTitle='Create Shipping Order' created_column={true} source='shippings_orders' />
                </Block>
            </Grid>
        </Grid>
    </Box>
  )
}

export default Shipping
