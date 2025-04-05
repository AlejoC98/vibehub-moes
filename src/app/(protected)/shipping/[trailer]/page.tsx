'use client'
import { Box, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import Grid from '@mui/material/Grid2'
import Details from '../../../../../components/details'
import PickListForm from '../../../../../components/forms/pick_list_form'
import { Block } from '../../../../../style/global'
import { useParams } from 'next/navigation'
import { GlobalContext } from '../../../../../utils/context/global_provider'
import { ShippingContent } from '../../../../../utils/interfaces'
import Swal from 'sweetalert2'
import BasicTable from '../../../../../components/tables/basic_table'
import { GridColDef } from '@mui/x-data-grid'
import CompleteOrderForm from '../../../../../components/forms/complete_shipping_form'

const OrderDetails = () => {

  const params = useParams();
  const { shippings } = useContext(GlobalContext);
  const [data, setData] = useState<ShippingContent>();
  const [totalOrderShipped, setTotalOrderShipped] = useState<number>();

  const PickListColumns: GridColDef[] = [
    { field: 'pl_number', headerName: 'PL #', pinnable: true },
    { field: 'bol_number', headerName: 'BOL #' },
    { field: 'picker_name', headerName: 'Picker' },
    { field: 'verified_by', headerName: 'Verified By' },
    { field: 'total_products', headerName: 'Total Products' },
  ];

  useEffect(() => {
    var currentShipping = shippings?.find(s => s.trailer_number == params?.trailer!);
    if (currentShipping != null) {
      const totalProducts = currentShipping?.shippings_pick_list
        ?.reduce((sum, item) => sum + item.total_products, 0) ?? 0;
      setTotalOrderShipped(totalProducts);
      setData(currentShipping);
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Opsss!',
        text: 'We couldn\'t find this information'
      });
    }
  }, [params])

  return (
    <Box>
      <Details
        editForm={<CompleteOrderForm />}
        actionButton={ data?.status != 'Shipped' ? 'Complete' : undefined}
        actionButtonColor='#64B6AC'
        title='Shipping Order'
        modalTitle='Complete Shipping Order?'
        data={data}
      >
        <Grid size={{ xl: 2, lg: 2, md: 12, sm: 12, xs: 12}} sx={{ marginBottom: 5}}>
          <Block>
            <Grid container spacing={2}>
              <Grid size={12}>
                <Typography variant='h6' fontWeight='bold'>Carrier</Typography>
                <Typography>{data?.carrier}</Typography>
              </Grid>
              <Grid size={12}>
                <Typography variant='h6' fontWeight='bold'>Dock Door</Typography>
                <Typography>{data?.dock_door}</Typography>
              </Grid>
              <Grid size={12}>
                <Typography variant='h6' fontWeight='bold'>Trailer Number</Typography>
                <Typography>{data?.trailer_number}</Typography>
              </Grid>
              <Grid size={12}>
                <Typography variant='h6' fontWeight='bold'>Total Shipped</Typography>
                <Typography>{totalOrderShipped}</Typography>
              </Grid>
              <Grid size={12}>
                <Typography variant='h6' fontWeight='bold'>Shipped</Typography>
                <Typography>{totalOrderShipped}</Typography>
              </Grid>
            </Grid>
          </Block>
        </Grid>
        <Grid size={{ xl: 10, lg: 10, md: 12, sm: 12, xs: 12}} sx={{ marginBottom: 5}}>
          <Block>
            <BasicTable title='Pick Lists' data={data?.shippings_pick_list || []} columns={PickListColumns} createForm={data?.status != 'Shipped' ? <PickListForm /> : undefined} createFormTitle={data?.status != 'Shipped' ?'Add Pick List' : undefined} />
          </Block>
        </Grid>
      </Details>
    </Box>
  )
}

export default OrderDetails
