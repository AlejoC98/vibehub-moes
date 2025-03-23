'use client'
import { useParams } from 'next/navigation';
import React, { ReactNode, useContext, useEffect, useRef, useState } from 'react'
import { GlobalContext } from '../../../../../utils/context/global_provider';
import { GridColDef } from '@mui/x-data-grid';
import { ProductContent } from '../../../../../utils/interfaces';
import { Box, Divider, IconButton, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2'
import { Block } from '../../../../../style/global';
import PrintIcon from '@mui/icons-material/Print';
import Barcode from 'react-barcode';
import { NumericFormat } from 'react-number-format';
import BasicTable from '../../../../../components/tables/basic_table';
import Details from '../../../../../components/details';
import ProductsForm from '../../../../../components/forms/products_form';
import { useReactToPrint } from 'react-to-print';

const InventoryDetails = () => {
    const params = useParams();
    const { products, users, racks } = useContext(GlobalContext);
    const [type, setType] = useState<string>();
    const [data, setData] = useState<any>();
    const barcodeRef = useRef(null);
    const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

    useEffect(() => {
      if (products !== undefined) {
        const allRackLocations = racks?.flatMap(rack => rack.racks_locations);


        const productData = products.find(x => x.sku === params?.sku![0]);
        const rackData = allRackLocations?.find(x => x.sku?.toString() === params?.sku![0]);
  
        if (productData != null) {
          setType('product');
          setData(productData);
        } else if (rackData != null) {
          setType('rack');
          setData(rackData);
        }
  
      }
    }, [products, users, params, racks]);

  if (type == 'rack') {
    return (
      <Grid container spacing={2}>
        <Grid size={3}>
          <Block sx={{ display: 'grid', placeItems: 'center'}}>
            <Typography variant='h4'>Rack { data['name'] }</Typography>
            <IconButton onClick={() => reactToPrintFn()}>
              <PrintIcon />
            </IconButton>
            <Box ref={contentRef}>
              <Barcode ref={barcodeRef} value={data?.sku} height={40} background='transparent' />
            </Box>
          </Block>
        </Grid>
        <Grid size={9}>
          <Block>
           <Typography variant='h4'>Content</Typography>
           <Grid container spacing={2}>
            <Grid size={4}>
              <Typography variant='h6'>Product</Typography>
              <Typography>{data['racks_locations_products'][0]['products']['name']}</Typography>
            </Grid>
            <Grid size={4}>
              <Typography variant='h6'>Quantity</Typography>
              <Typography>{data['racks_locations_products'][0]['quantity']}</Typography>
            </Grid>
            <Grid size={4}>
            <Typography variant='h6'>Created At</Typography>
            <Typography>{data['racks_locations_products'][0]['quantity']}</Typography>
            </Grid>
           </Grid>
          </Block>
        </Grid>
      </Grid>
    )
  }

  if (type == 'product') {
    return (
      <Grid container spacing={2}>
        <Grid size={3}>
          <Block sx={{ display: 'grid', placeItems: 'center'}}>
            <Typography variant='h4'>{ data['name'] }</Typography>
            <IconButton onClick={() => reactToPrintFn()}>
              <PrintIcon />
            </IconButton>
            <Box ref={contentRef}>
              <Barcode ref={barcodeRef} value={data?.sku} height={40} background='transparent' />
            </Box>
          </Block>
        </Grid>
        <Grid size={9}>
          <Block>
            Products
          </Block>
        </Grid>
      </Grid>
    )
  }
}

export default InventoryDetails
