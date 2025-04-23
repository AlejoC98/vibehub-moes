'use client'
import { Box, Skeleton } from '@mui/material'
import Grid from '@mui/material/Grid2'
import Block from '@/components/block'
import BasicTable from '@/components/tables/basic_table'
import ProductsForm from '@/components/forms/products_form'
import { GridColDef } from '@mui/x-data-grid'
import RacksForm from '@/components/forms/racks_form'
import { useContext, useEffect, useState } from 'react'
import { GlobalContext } from '@/utils/context/global_provider'
import { ProductContent, RackLocationContent } from '@/utils/interfaces'

const Inventory = () => {
  const { products, setIsLaunching } = useContext(GlobalContext);

  const productsColumns: GridColDef[] = [
    {
      field: 'img_url', headerName: 'Image', renderCell: (params) => (
        <Box sx={{ display: 'grid', placeItems: 'center' }}>
          <img src={params.row.img_url} style={{ width: 45, height: 45 }} alt="" />
        </Box>
      )
    },
    { field: 'sku', headerName: 'Sku' },
    { field: 'item', headerName: 'Item' },
    { field: 'name', headerName: 'Name' },
    {
      field: 'deleted', headerName: 'Status', renderCell: (params) => (
        <Box className={`${params.row.deleted ? 'bg-red-800' : 'bg-green-800'} text-white px-2 py-1 rounded-lg`}>{params.row.deleted ? 'Inactive' : 'Active'}</Box>
      )
    }
  ];

  useEffect(() => {
    setIsLaunching(false);
  }, []);
  return (
    <Box>
      <Grid container spacing={10}>
        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12}}>
          <Block>
            <BasicTable title='Inventory' data={products || []} columns={productsColumns} createForm={<ProductsForm />} createFormTitle="New Item" />
          </Block>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Inventory