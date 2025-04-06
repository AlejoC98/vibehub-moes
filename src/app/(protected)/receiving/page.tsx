'use client'
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import React, { useContext, useEffect } from 'react'
import { GlobalContext } from '../../../../utils/context/global_provider';
import BasicTable from '../../../../components/tables/basic_table';
import { GridColDef } from '@mui/x-data-grid';
import ReceivingForm from '../../../../components/forms/receiving_form';
import { Block } from '../../../../style/global';

const Receiving = () => {
  
  const { receivings, setIsLaunching } = useContext(GlobalContext);

  const receivingColumns: GridColDef[] = [
    { field: 'id', headerName: 'ID' },
    { field: 'po_number', headerName: 'PO #' },
    { field: 'arrived_at', headerName: 'Arrived At' },
    { field: 'trailer_number', headerName: 'Trailer #' },
    {
      field: 'vendor_id', headerName: 'Vendor', renderCell: (params) => {
        return params.row.vendors.name
      }
    },
    {field: 'status', headerName: 'Status'},
    // { field: 'deleted', headerName: 'Status', renderCell: (params) => (
    //   <Box className={`${params.row.deleted ? 'bg-red-800' : 'bg-green-800'} text-white px-2 py-1 rounded-lg`}>{params.row.deleted ? 'Inactive' : 'Active'}</Box>
    // )}
  ];

  useEffect(() => {
    setIsLaunching(false);
  }, []);

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid size={12}>
          <Block>
            <BasicTable title='Receiving Process' data={receivings || []} columns={receivingColumns} createForm={<ReceivingForm />} createFormTitle="Start Receiving" />
          </Block>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Receiving
