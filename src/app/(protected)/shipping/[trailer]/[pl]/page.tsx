'use client'
import { useParams } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react'
import { GlobalContext } from '@/utils/context/global_provider';
import { PickListContent } from '@/utils/interfaces';
import Swal from 'sweetalert2';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2'
import { Block } from '@/style/global';
import BasicTable from '@/components/tables/basic_table';
import { GridColDef } from '@mui/x-data-grid';
import Details from '@/components/details';

const PickListDetails = () => {

  const params = useParams();
  const { shippings, setIsLaunching } = useContext(GlobalContext);

  const [data, setData] = useState<PickListContent>();

  const shippingProductsColumns: GridColDef[] = [
      { field: 'product_sku', headerName: 'Sku' },
      { field: 'product_quantity', headerName: 'Quantity' },
    ];

  useEffect(() => {
    const currentPL = shippings
      ?.flatMap(s => s.shippings_pick_list)
      .find(spl => spl.pl_number === parseInt(params.pl as string));
    if (currentPL != null) {
      setData(currentPL);
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Opsss!',
        text: 'We couldn\'t find this information'
      });
    }
    setIsLaunching(false);
  }, [params])

  return (
    <Box>
      <Details title='Pick List' actionButtons={[]}>
      <Grid size={{ xl: 3, lg: 3, md: 12, sm: 12, xs: 12}} sx={{ marginBottom: 5}}>
          <Block>
            <Grid container spacing={5}>
              <Grid size={{ lg: 6, md: 6, sm: 12, xs: 12 }}>
                <Typography align='center' fontWeight={'bold'}>PL Number</Typography>
                <Typography align='center' >{data?.pl_number}</Typography>
              </Grid>
              <Grid size={{ lg: 6, md: 6, sm: 6, xs: 6 }}>
                <Typography align='center' fontWeight={'bold'}>BOL Number</Typography>
                <Typography align='center' >{data?.bol_number}</Typography>
              </Grid>
              <Grid size={{ lg: 6, md: 6, sm: 6, xs: 6 }}>
                <Typography align='center' fontWeight={'bold'}>Picker Name</Typography>
                <Typography align='center' >{data?.picker_name}</Typography>
              </Grid>
              <Grid size={{ lg: 6, md: 6, sm: 6, xs: 6 }}>
                <Typography align='center' fontWeight={'bold'}>Verified By</Typography>
                <Typography align='center' >{data?.verified_by}</Typography>
              </Grid>
              <Grid size={12}>
                <Typography align='center' fontWeight={'bold'}>Notes</Typography>
                <Typography align='center' >{data?.notes || '...'}</Typography>
              </Grid>
            </Grid>
          </Block>
        </Grid>
        <Grid size={{ xl: 9, lg: 9, md: 12, sm: 12, xs: 12}} sx={{ marginBottom: 5}}>
          <Block>
          <BasicTable title='Product on order' data={data?.shippings_products || []} columns={shippingProductsColumns} created_column={true} />
          </Block>
        </Grid>
      </Details>
    </Box>
  )
}

export default PickListDetails
