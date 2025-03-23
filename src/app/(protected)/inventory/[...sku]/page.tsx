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

const InventoryDetails = () => {
    const params = useParams();
  const { products, users, racks } = useContext(GlobalContext);
  const [data, setData] = useState<any>();
  const barcodeRef = useRef(null);

  const positionColumns: GridColDef[] = [
    { field: 'id', headerName: 'ID'},
    { field: 'name', headerName: 'Position Name'},
//     { field: 'quantity', headerName: 'Quantity', valueGetter: (params) => {
//       return products?.find((product: ProductContent) => product.positions.some(position => position.positionId === params.id))
//   ?.positions.find(position => position.positionId === params.id)?.quantity;
//     }},
    { field: 'rowPosition', headerName: '#Rows'},
    { field: 'columnPosition', headerName: '#Column'},
    { field: 'deleted', headerName: 'Status', renderCell: (params) => (
      <Box>{params.row.deleted ? 'Inactive' : 'Active'}</Box>
    )}
  ];

  const productsColumns: GridColDef[] = [
    { field: 'id', headerName: 'ID'},
    { field: 'name', headerName: 'Name'},
//     { field: 'quantity', headerName: 'Quantity', valueGetter: (params) => {
//       return products?.find((product: ProductContent) => product.positions.some(position => position.positionId === data.id))
//   ?.positions.find(position => position.positionId === data.id)?.quantity;
//     }},
    { field: 'unit_price', headerName: 'Unit Price'},
    { field: 'total_price', headerName: 'Total Price'},
    { field: 'deleted', headerName: 'Status', renderCell: (params) => (
      <Box>{params.row.deleted ? 'Inactive' : 'Active'}</Box>
    )}
  ];

  useEffect(() => {
    if (products !== undefined) {
      const productsData = 
        products.find(x => x.sku === params?.sku![0])
        || racks?.find(x => x.racks_locations.find(rl => rl.sku == params?.sku![0]))
        // || racks?.find(x => x.sku === params?.sku![0])
        // || racks?.flatMap(rack => rack.position).find(p => p?.sku === params?.sku![0]);
      setData(productsData);
    }
  }, [products, users, params, racks]);

  const detailsContent: ReactNode[] = [
    <Grid size={{ md:12, lg:5 }} key={1}>
      <Block>
        <Typography variant='h4'>About</Typography>
        <Divider />
        <Grid container spacing={2}>
          <Grid size={6}>
            <Box>
              <Box>
                <Typography variant='h4'>Sku</Typography>
              </Box>
              <Box>
                {/* <ReactToPrint
                  trigger={() => <IconButton>
                    <PrintIcon />
                  </IconButton>}
                  content={() => barcodeRef.current}
                /> */}
                <Barcode ref={barcodeRef} value={data?.sku} height={40} background='transparent' />
              </Box>
            </Box>
          </Grid>
          <Grid size={6}>
            <Box>
              <Box>
                <Typography variant='h4'>Name</Typography>
              </Box>
              <Box>
                <Typography variant='h5'>{data?.name}</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Block>
    </Grid>,
    <Grid size={{ md:12, lg:7 }} key={2}>
      <Block>
        <Typography variant='h4'>
          Info
        </Typography>
        <Divider />
        <Grid container spacing={2}>
          <Grid size={4}>
            <Box>
              <Typography variant='h4'>Quantity</Typography>
              <p>{data?.quantity}</p>
            </Box>
          </Grid>
          <Grid size={4}>
            <Box>
              <Typography variant='h4'>Unit Price</Typography>
              <NumericFormat
                prefix='$'
                value={data?.unit_price}
                thousandSeparator=","
                decimalScale={2}
                displayType="text"
                renderText={(value) => <p>{value}</p>}
              />
            </Box>
          </Grid>
          <Grid size={4}>
            <Box>
              <Typography variant='h4'>Total Price</Typography>
              <NumericFormat
                prefix='$'
                value={data?.total_price}
                thousandSeparator=","
                decimalScale={2}
                displayType="text"
                renderText={(value) => <p>{value}</p>}
              />
            </Box>
          </Grid>
          <Grid size={4}>
            <Box>
              <Typography variant='h4'>Status</Typography>
              <Box>{data?.deleted ? 'Inactive' : 'Active'}</Box>
            </Box>
          </Grid>
          <Grid size={4}>
            <Box>
              <Typography variant='h4'>Created By</Typography>
              {/* <p>{foundCreator(data?.createdBy)}</p> */}
            </Box>
          </Grid>
          <Grid size={4}>
            <Box>
              <Typography variant='h4'>Created At</Typography>
              <p>{new Date(data?.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
            </Box>
          </Grid>
        </Grid>
      </Block>
    </Grid>,
    data && data.hasOwnProperty('position') && (
      <Grid size={12} key={3}>
      <Block>
          <BasicTable title='Positions' data={data && data.hasOwnProperty('position') ? data.position : []} columns={positionColumns} createForm={<></>} createFormTitle='New Position'/>
        </Block>
    </Grid>  
    ),
    data && data.hasOwnProperty('rackId') && (
      <Grid size={12} key={4}>
        <Block>
        <BasicTable title="Products in location" data={data && data.hasOwnProperty('products') ? data.products.map((pospro: { product: any; }) => pospro.product) : []} columns={productsColumns} />
        </Block>
      </Grid>
    ),
    data && data['locations'].length > 0 && (
      <Grid size={12} key={5}>
        <Block>
            <Typography>Lore</Typography>
          <BasicTable title="Locations" data={data && data['locations'].length > 0 ? data['locations'].map((pospro: { position: any; }) => pospro.position) : []} columns={positionColumns} />
        </Block>
      </Grid>
    )
  ]

  return (
    <Box>
    <Details content={detailsContent} data={data} editForm={<ProductsForm />} />
  </Box>
  )
}

export default InventoryDetails
