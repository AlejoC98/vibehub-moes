'use client'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import Grid from '@mui/material/Grid2';
import Block from '@/components/block';
import BasicTable from '@/components/tables/basic_table';
import { GlobalContext } from '@/utils/context/global_provider';
import { GridColDef } from '@mui/x-data-grid';
import { convertTimeByTimeZone } from '@/utils/functions/main';
import ShippingForm from '@/components/forms/shipping/shipping_form';
import StatusBadge from '@/components/status_badge';
import { toast } from 'react-toastify';
import axios from 'axios';
import SubmitButton from '@/components/submit_button';

const Shipping = () => {

  const { shippings, userAccount, setIsLaunching } = useContext(GlobalContext);
  
  const [orderId, setOrderId] = useState<string>();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const showIdColumn = userAccount?.accounts_roles?.some(r => r.role_id === 1);

  const shippingColumns: GridColDef[] = [
    ...(showIdColumn ? [{ field: 'id', headerName: 'ID', width: 50 }] : []),
    { field: 'carrier', headerName: 'Carrier', width: 100 },
    { field: 'trailer_number', headerName: 'Trailer #' },
    { field: 'total_shipped', headerName: 'Total Shipped', width: 110 },
    {
      field: 'shippings_pick_list', headerName: 'Total Pick Lists', renderCell: (params) => {
        return params.row.shippings_pick_list.length;
      }, width: 120
    },
    {
      field: 'created_at', headerName: 'Created At', renderCell: (params) => {
        return convertTimeByTimeZone(userAccount?.sessionTimeZone!, params.row.created_at);
      }, width: 180
    },
    {
      field: 'closed_at', headerName: 'Closed At', renderCell: (params) => {
        if (params.row.closed_at != null) {
          return convertTimeByTimeZone(userAccount?.sessionTimeZone!, params.row.closed_at);
        } else {
          return params.row.closed_at;
        }
      }, width: 180, editable: false
    },
    {
      field: 'status', headerName: 'Status', renderCell: (params) => {
        return <StatusBadge status={params.row.status} />
      }
    }
  ];

  const hanldeAdminCloseOrder = async () => {
    try {
      
      setIsLoading(true);
      
      if (orderId == '' || orderId == undefined) throw new Error('Order Id is required');
      await axios.post('/api/shipping/', {
        orderId: orderId
      }).then((res) => {
        console.log(res.data);
      }).catch((err) => {
        throw new Error(err.message);
      });
    } catch (error: any) {
      console.log(error.message);
      toast.warning('Error closing order');
    }
    setIsLoading(false);
  }

  useEffect(() => {
    setIsLaunching(false);
  }, []);

  return (
    <Box>
      <Grid container spacing={5}>
        <Grid size={12}>
          <Block>
            <BasicTable
              title='Shipping Orders'
              data={shippings || []}
              columns={shippingColumns}
              createForm={<ShippingForm />}
              createFormTitle='Create Shipping Order'
              created_column={true}
              source='shippings_orders'
              actionButtons={[
                <Button key='admin-close' variant='contained' className='btn-bittersweet' onClick={() => setOpenModal(true)}>Admin Close</Button>
              ]}
            />
          </Block>
        </Grid>
      </Grid>
      <Dialog
        open={openModal}
        maxWidth='md'
        onClose={() => setOpenModal(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle variant='h5'>
          Admin close order
        </DialogTitle>
        <DialogContent>
          <Box p={1}>
            <TextField
              required
              fullWidth
              label='Order Id'
              onChange={(e) => setOrderId(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between'}}>
          <Button variant='contained' className='btn-gunmetal'>Close</Button>
          <SubmitButton
            autoFocus
            isLoading={isLoading}
            btnText='Complete'
            variant='contained'
            className='btn-munsell'
            onClick={hanldeAdminCloseOrder}
          />
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Shipping
