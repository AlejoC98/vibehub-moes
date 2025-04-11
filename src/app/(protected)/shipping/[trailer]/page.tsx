'use client'
import { Box, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import Grid from '@mui/material/Grid2'
import Details from '@/components/details'
import PickListForm from '@/components/forms/pick_list_form'
import { Block } from '@/style/global'
import { useParams } from 'next/navigation'
import { GlobalContext } from '@/utils/context/global_provider'
import { ShippingContent } from '@/utils/interfaces'
import Swal from 'sweetalert2'
import BasicTable from '@/components/tables/basic_table'
import { GridColDef } from '@mui/x-data-grid'
import CompleteOrderForm from '@/components/forms/complete_shipping_form'
import SearchList from '@/components/search_pick_list'
import dayjs from 'dayjs'
import { convertTimeByTimeZone, findUserByUUID } from '@/utils/functions/main'

const OrderDetails = () => {

  const params = useParams();
  const { shippings, users, setIsLaunching } = useContext(GlobalContext);

  const [data, setData] = useState<ShippingContent>();
  const [createdBy, setCreatedBy] = useState<string>();
  const [closedBy, setCloseddBy] = useState<string>();
  const [totalOrderShipped, setTotalOrderShipped] = useState<number>();

  const actionButtons = [
    {
      'text': data?.status != 'Shipped' ? 'Complete' : undefined,
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

    setCreatedBy(findUserByUUID(users!, data?.created_by!));
    setCloseddBy(findUserByUUID(users!, data?.created_by!));

    if (shippings != undefined) {
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
    }
  }, [shippings])

  return (
    <Box>
      <Details
        actionButtons={actionButtons}
        title='Shipping Order'
        modalTitle='Complete Shipping Order?'
      >
        <Grid size={{ xl: 3, lg: 3, md: 12, sm: 12, xs: 12 }} sx={{ marginBottom: 5 }}>
          <Block>
            <Grid container spacing={5}>
              <Grid size={6}>
                {createdBy != undefined && (
                  <Box>
                    <Typography variant='h6' fontWeight='bold'>Created By</Typography>
                    <Typography>{ }</Typography>
                  </Box>
                )}
                <Box>
                  <Typography variant='h6' fontWeight='bold'>Carrier</Typography>
                  <Typography>{data?.carrier}</Typography>
                </Box>
                <Box>
                  <Typography variant='h6' fontWeight='bold'>Trailer Number</Typography>
                  <Typography>{data?.trailer_number}</Typography>
                </Box>
                {data?.closed_by != null && (
                  <Box>
                    <Typography variant='h6' fontWeight='bold'>Close By</Typography>
                    <Typography>{ closedBy }</Typography>
                  </Box>
                )}
                {data?.closed_at != null && (
                  <Box>
                    <Typography variant='h6' fontWeight='bold'>Close By</Typography>
                    <Typography>{convertTimeByTimeZone(data?.closed_at)}</Typography>
                  </Box>
                )}
              </Grid>
              <Grid size={6}>
                {data?.created_at != undefined && (
                  <Box>
                    <Typography variant='h6' fontWeight='bold'>Created At</Typography>
                    <Typography>{dayjs(data?.created_at).format('ddd MMM DD YYYY hh:mm A')}</Typography>
                  </Box>
                )}
                <Box>
                  <Typography variant='h6' fontWeight='bold'>Dock Door</Typography>
                  <Typography>{data?.dock_door}</Typography>
                </Box>
                <Box>
                  <Typography variant='h6' fontWeight='bold'>Total Shipped</Typography>
                  <Typography>{totalOrderShipped}</Typography>
                </Box>
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
