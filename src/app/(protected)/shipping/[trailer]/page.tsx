'use client'
import { Box, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import Grid from '@mui/material/Grid2'
import Details from '@/components/details'
import PickListForm from '@/components/forms/pick_list_form'
import { Block } from '@/style/global'
import { useParams, useRouter } from 'next/navigation'
import { GlobalContext } from '@/utils/context/global_provider'
import { ShippingContent } from '@/utils/interfaces'
import Swal from 'sweetalert2'
import CompleteOrderForm from '@/components/forms/complete_shipping_form'
import SearchList from '@/components/search_pick_list'
import { convertTimeByTimeZone, findUserByUUID } from '@/utils/functions/main'

const OrderDetails = () => {

  const params = useParams();
  const router = useRouter();
  const { shippings, users, userAccount, setIsLaunching } = useContext(GlobalContext);

  const [data, setData] = useState<ShippingContent>();
  const [createdBy, setCreatedBy] = useState<string>();
  const [closedBy, setCloseddBy] = useState<string>();
  const [totalOrderShipped, setTotalOrderShipped] = useState<number>();

  const actionButtons = [
    {
      'text': data?.status && 'Complete',
      'color': '#64B6AC',
      'form': <CompleteOrderForm />,
      'data': data
    },
    {
      'text': 'Add Pick',
      'color': '#333',
      'form': <PickListForm />,
      'data': {}
    },
  ]

  useEffect(() => {
    setIsLaunching(false);
  }, [params])

  useEffect(() => {
    var currentShipping = shippings?.find(s => s.trailer_number == params?.trailer!);
    if (shippings != undefined) {
      if (currentShipping != null) {
        const totalProducts = currentShipping?.shippings_pick_list
          ?.reduce((sum, item) => sum + item.total_products, 0) ?? 0;
        setTotalOrderShipped(totalProducts);
        setData(currentShipping);
        setCreatedBy(findUserByUUID(users!, currentShipping.created_by!));
        setCloseddBy(findUserByUUID(users!, currentShipping.closed_by!));
      }
      // else {
      //   Swal.fire({
      //     icon: 'info',
      //     title: 'Opsss!',
      //     text: 'We couldn\'t find this information'
      //   }).then((result) => {
      //     if (result.isConfirmed) {
      //       router.back();
      //     }
      //   })
      // }
    }
  }, [shippings]);

  return (
    <Box>
      <Details
        actionButtons={data?.status != 'Shipped' ? actionButtons : []}
        title='Shipping Order'
        modalTitle='Complete Shipping Order?'
      >
        <Grid size={{ xl: 3, lg: 3, md: 12, sm: 12, xs: 12 }} sx={{ marginBottom: 5 }}>
          <Block>
            <Grid container spacing={5}>
              {createdBy != undefined && (
                <Grid size={6}>
                  <Typography variant='h6' fontWeight='bold'>Created By</Typography>
                  <Typography>{ }</Typography>
                </Grid>
              )}
              {data?.created_at != undefined && (
                <Grid size={createdBy != undefined ? 6 : 12}>
                  <Typography variant='h6' fontWeight='bold'>Created At</Typography>
                  <Typography>{convertTimeByTimeZone(userAccount?.sessionTimeZone!, data?.created_at)}</Typography>
                </Grid>
              )}
              <Grid size={6}>
                <Typography variant='h6' fontWeight='bold'>Carrier</Typography>
                <Typography>{data?.carrier}</Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant='h6' fontWeight='bold'>Trailer Number</Typography>
                <Typography>{data?.trailer_number}</Typography>
              </Grid>
              {closedBy != undefined && (
                <Grid size={6}>
                  <Typography variant='h6' fontWeight='bold'>Closed By</Typography>
                  <Typography>{closedBy}</Typography>
                </Grid>
              )}
              {data?.closed_at != null && (
                <Grid size={6}>
                  <Typography variant='h6' fontWeight='bold'>Closed At</Typography>
                  <Typography>{convertTimeByTimeZone(userAccount?.sessionTimeZone!, data?.closed_at)}</Typography>
                </Grid>
              )}
              <Grid size={6}>
                <Typography variant='h6' fontWeight='bold'>Dock Door</Typography>
                <Typography>{data?.dock_door}</Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant='h6' fontWeight='bold'>Total Shipped</Typography>
                <Typography>{totalOrderShipped}</Typography>
              </Grid>
            </Grid>
          </Block>
        </Grid>
        <Grid size={{ xl: 9, lg: 9, md: 12, sm: 12, xs: 12 }} sx={{ marginBottom: 5 }}>
          <Block>
            <SearchList
              data={data?.shippings_pick_list!}
            />
          </Block>
        </Grid>
      </Details>
    </Box>
  )
}

export default OrderDetails
