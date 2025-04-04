'use client'
import { Box, Button, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import Grid from '@mui/material/Grid2';
import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';
import { useParams, useRouter } from 'next/navigation';
import { Block } from '../../../../../style/global';
import { GlobalContext } from '../../../../../utils/context/global_provider';
import { ShippingContent } from '../../../../../utils/interfaces';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import BasicTable from '../../../../../components/tables/basic_table';
import { GridColDef } from '@mui/x-data-grid';

const ShippingDetails = () => {
  
  const router = useRouter();
  const params = useParams();
  const { shippings } = useContext(GlobalContext);
  const [data, setData] = useState<ShippingContent>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const shippingProductsColumns: GridColDef[] = [
    { field: 'id', headerName: 'ID' },
    { field: 'product_sku', headerName: 'Sku' },
    { field: 'product_quantity', headerName: 'Quantity' },
  ];

  const generateStatusBlock = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Box sx={{background: '#FFE082', color: "#FFFFFF", width: 80, textAlign: 'center', borderRadius: 1}}>
          <Typography>{status}</Typography>
        </Box>;
      case 'Processing':
        return <Box sx={{background: '#64B5F6', color: "#FFFFFF", width: 80, textAlign: 'center', borderRadius: 1}}>
          <Typography>{status}</Typography>
        </Box>;
      case 'Shipped':
        return <Box sx={{background: '#242f40', color: "#FFFFFF", width: 80, textAlign: 'center', borderRadius: 1}}>
          <Typography>{status}</Typography>
        </Box>;
      case 'Delivered':
        return <Box sx={{background: '#81C784', color: "#FFFFFF", width: 80, textAlign: 'center', borderRadius: 1}}>
          <Typography>{status}</Typography>
        </Box>;
      case 'Cancelled':
        return <Box sx={{background: '#E57373', color: "#FFFFFF", width: 80, textAlign: 'center', borderRadius: 1}}>
          <Typography>{status}</Typography>
        </Box>;
      default:
        return <Box sx={{or: "#FFFFFF", height: '100%', display: 'grid', placeItems: 'center'}}>
          <Typography sx={{ background: '#EEE', padding: '.5px 2px', borderRadius: 1 }}>{status}</Typography>
        </Box>;
    }
  }

  useEffect(() => {
    var currentShipping = shippings?.find(s => s.pl_number == parseInt(params?.pl![0]));
    if (currentShipping != null) {
      setData(currentShipping);
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Opsss!',
        text: 'We couldn\'t find this information'
      });

      setTimeout(() => {
        router.back();
      }, 3000);
    }
  }, [params])

  return (
    <Box>
      <Grid container spacing={2}>
            <Grid size={1}>
                <Box sx={{ display: 'grid', placeItems: 'center'}}>
                    <IconButton onClick={() => router.back()}>
                        <ArrowBackTwoToneIcon />
                    </IconButton>
                </Box>
            </Grid>
            <Grid size={11}>
              <Box sx={{ display: 'flex', justifyContent: isMobile ? 'center' : 'normal', placeItems: 'center', gap: 2}}>
                <Typography variant='h5' fontWeight={'bold'}>
                  Shipping Details
                </Typography>
                {generateStatusBlock(data?.status || '')}
              </Box>
            </Grid>
            <Grid size={{ xl: 6, lg: 6, md: 12, sm: 12, xs: 12}} sx={{ mb: 10}}>
              <Block>
                <Grid container spacing={5}>
                  <Grid size={{ lg: 3, md: 3, sm: 6, xs: 6}}>
                    <Typography align='center'  fontWeight={'bold'}>Created At</Typography>
                    <Typography align='center' >{ dayjs(data?.created_at).format('ddd MMM DD YYYY') }</Typography>
                  </Grid>
                  <Grid size={{ lg: 3, md: 3, sm: 6, xs: 6}}>
                    <Typography align='center'  fontWeight={'bold'}>Shipped At</Typography>
                    <Typography align='center' >{ dayjs(data?.created_at).format('ddd MMM DD YYYY') }</Typography>
                  </Grid>
                  <Grid size={{ lg: 3, md: 3, sm: 12, xs: 12}}>
                    <Typography align='center'  fontWeight={'bold'}>PL Number</Typography>
                    <Typography align='center' >{ data?.pl_number }</Typography>
                  </Grid>
                  <Grid size={{ lg: 3, md: 3, sm: 6, xs: 6}}>
                    <Typography align='center'  fontWeight={'bold'}>BOL Number</Typography>
                    <Typography align='center' >{ data?.bol_number }</Typography>
                  </Grid>
                  <Grid size={{ lg: 3, md: 3, sm: 6, xs: 6}}>
                    <Typography align='center'  fontWeight={'bold'}>Carrier</Typography>
                    <Typography align='center' >{ data?.carrier }</Typography>
                  </Grid>
                  <Grid size={{ lg: 3, md: 3, sm: 6, xs: 6}}>
                    <Typography align='center'  fontWeight={'bold'}>Trailer #</Typography>
                    <Typography align='center' >{ data?.trailer_number }</Typography>
                  </Grid>
                  <Grid size={{ lg: 3, md: 3, sm: 6, xs: 6}}>
                    <Typography align='center'  fontWeight={'bold'}>Picker Name</Typography>
                    <Typography align='center' >{ data?.picker_name }</Typography>
                  </Grid>
                  <Grid size={{ lg: 3, md: 3, sm: 6, xs: 6}}>
                    <Typography align='center'  fontWeight={'bold'}>Verified By</Typography>
                    <Typography align='center' >{ data?.verified_by }</Typography>
                  </Grid>
                  <Grid size={{ lg: 3, md: 3, sm: 6, xs: 6}}>
                    <Typography align='center'  fontWeight={'bold'}>Total Products Quantity</Typography>
                    <Typography align='center' >{ data?.shipped_quantity }</Typography>
                  </Grid>
                  <Grid size={12}>
                    <Typography align='center'  fontWeight={'bold'}>Notes</Typography>
                    <Typography align='center' >{ data?.notes || '...' }</Typography>
                  </Grid>
                </Grid>
              </Block>
            </Grid>
            <Grid size={{ xl: 6, lg: 6, md: 12, sm: 12, xs: 12}} sx={{ mb: 10}}>
              <Block>
               <BasicTable title='Product on order' data={data?.shippings_products || []} columns={shippingProductsColumns} />
              </Block>
            </Grid>
        </Grid>
    </Box>
  )
}

export default ShippingDetails
