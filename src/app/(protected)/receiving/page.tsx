'use client'
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import React, { useContext, useState } from 'react'
import { GlobalContext } from '../../../../utils/context/global_provider';
import { searchSku } from '../../../../utils/functions/main';
import BasicTable from '../../../../components/tables/basic_table';
import { GridColDef } from '@mui/x-data-grid';
import ReceivingForm from '../../../../components/forms/receiving_form';
import { Block } from '../../../../style/global';

const Receiving = () => {
  const { products } = useContext(GlobalContext);

  // const handleSearchProduct = (value: string) => {
  //   const response = searchSku(products!, value);
  //   if (response !== undefined) {
  //     setProduct(response!);
  //   }
  // }

  const receivingColumns: GridColDef[] = [
          { field: 'id', headerName: 'ID'},
          { field: 'name', headerName: 'Name'},
          // { field: 'quantity', headerName: 'Quantity', valueGetter: (params) => {
          //   return products?.reduce((total, product) => {
          //     return total + product.positions.reduce((positionTotal, position) => positionTotal + position.quantity, 0);
          //   }, 0);
          // }},
          { field: 'unit_price', headerName: 'Unit Price'},
          { field: 'total_price', headerName: 'Total Price'},
          { field: 'deleted', headerName: 'Status', renderCell: (params) => (
            <Box className={`${params.row.deleted ? 'bg-red-800' : 'bg-green-800'} text-white px-2 py-1 rounded-lg`}>{params.row.deleted ? 'Inactive' : 'Active'}</Box>
          )}
        ];

  return (
    <Box>
      <Grid container spacing={5}>
        <Grid size={12}>
          <Block>
            <BasicTable title='Receiving Process' data={[]} columns={receivingColumns} createForm={<ReceivingForm />} createFormTitle="Start Receiving" />
          </Block>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Receiving
