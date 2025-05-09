'use client'
import { Box, Button, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import Grid from '@mui/material/Grid2'
import Details from '@/components/details'
import Block from '@/components/block';
import { useParams, useRouter } from 'next/navigation'
import { GlobalContext } from '@/utils/context/global_provider'
import { ShippingContent } from '@/utils/interfaces'
import SearchList from '@/components/search_pick_list'
import { convertTimeByTimeZone, useFindUserByUUID } from '@/utils/functions/main'
import CompleteOrderForm from '@/components/forms/shipping/complete_shipping_form'
import { ImagePreviewDialog } from '@/components/image_preview_dialog'

const OrderDetails = () => {

  const params = useParams();
  const findUserByUUID = useFindUserByUUID();
  const { shippings, userAccount, setIsLaunching } = useContext(GlobalContext);

  const [data, setData] = useState<ShippingContent>();
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [totalOrderShipped, setTotalOrderShipped] = useState<number>();

  const actionButtons = [];

  if (
    isCompleted &&
    data?.closed_by == null &&
    userAccount?.accounts_roles?.find((r) => [1, 2, 3, 5, 7].includes(r.role_id))
  ) {
    actionButtons.push({
      text: 'Complete',
      color: '#64B6AC',
      form: <CompleteOrderForm />,
      data: data
    });
  }

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
        var isCompleted = currentShipping.shippings_pick_list.filter((pick) => pick.verified_by == null)
        setIsCompleted(isCompleted.length == 0);
      }
    }
  }, [shippings]);

  return (
    <Box>
      <Details
        actionButtons={actionButtons}
        title='Shipping Order'
        modalTitle='Complete Shipping Order?'
      >
        <Grid size={{ xl: 3, lg: 4, md: 12, sm: 12, xs: 12 }} sx={{ marginBottom: 5 }}>
          <Block sx={{ maxHeight: 600, overflowY: 'auto' }}>
            <Grid container spacing={5}>
              {data?.created_by != undefined && (
                <Grid size={{ xl: 6, lg: 12, md: 12, sm: 12, xs: 12 }}>
                  <Typography variant='h6' fontWeight='bold'>Created By</Typography>
                  <Typography>{findUserByUUID(data?.created_by!)}</Typography>
                </Grid>
              )}
              {data?.created_at != undefined && (
                <Grid size={{ xl: data?.created_by != undefined ? 6 : 12, lg: 12, md: 12, sm: 12, xs: 12 }}>
                  <Typography variant='h6' fontWeight='bold'>Created At</Typography>
                  <Typography>{convertTimeByTimeZone(userAccount?.sessionTimeZone!, data?.created_at)}</Typography>
                </Grid>
              )}
              <Grid size={{ xl: 6, lg: 12, md: 12, sm: 12, xs: 12 }}>
                <Typography variant='h6' fontWeight='bold'>Carrier</Typography>
                <Typography>{data?.carrier}</Typography>
              </Grid>
              <Grid size={{ xl: 6, lg: 12, md: 12, sm: 12, xs: 12 }}>
                <Typography variant='h6' fontWeight='bold'>Trailer Number</Typography>
                <Typography>{data?.trailer_number}</Typography>
              </Grid>
              {data?.closed_by != undefined && (
                <Grid size={{ xl: 6, lg: 12, md: 12, sm: 12, xs: 12 }}>
                  <Typography variant='h6' fontWeight='bold'>Closed By</Typography>
                  <Typography>{findUserByUUID(data?.closed_by!)}</Typography>
                </Grid>
              )}
              {data?.closed_at != null && (
                <Grid size={{ xl: 6, lg: 12, md: 12, sm: 12, xs: 12 }}>
                  <Typography variant='h6' fontWeight='bold'>Closed At</Typography>
                  <Typography>{convertTimeByTimeZone(userAccount?.sessionTimeZone!, data?.closed_at)}</Typography>
                </Grid>
              )}
              <Grid size={{ xl: 6, lg: 12, md: 12, sm: 12, xs: 12 }}>
                <Typography variant='h6' fontWeight='bold'>Dock Door</Typography>
                <Typography>{data?.dock_door}</Typography>
              </Grid>
              <Grid size={{ xl: 6, lg: 12, md: 12, sm: 12, xs: 12 }}>
                <Typography variant='h6' fontWeight='bold'>Total Shipped</Typography>
                <Typography>{totalOrderShipped}</Typography>
              </Grid>
              {data?.img_url != null && (
                <Grid size={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', placeItems: 'center' }}>
                    <ImagePreviewDialog imageUrl={data?.img_url!} />
                  </Box>
                </Grid>
              )}
            </Grid>
          </Block>
        </Grid>
        <Grid size={{ xl: 9, lg: 8, md: 12, sm: 12, xs: 12 }} sx={{ marginBottom: 5 }}>
          <Block sx={{ maxHeight: 600, overflowY: 'auto' }}>
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
