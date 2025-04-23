'use client'
import { Box } from '@mui/material'
import React, { useContext, useEffect } from 'react'
import Grid from '@mui/material/Grid2';
import Block from '@/components/block';
import BasicTable from '@/components/tables/basic_table';
import PickingForm from '@/components/forms/picking_form';
import { GridColDef } from '@mui/x-data-grid';
import { GlobalContext } from '@/utils/context/global_provider';

const Picking = () => {

    const { setIsLaunching } = useContext(GlobalContext);

      const pickingColumns: GridColDef[] = [
        { field: 'order_number', headerName: 'Order #' },
        { field: 'due_at', headerName: 'Due Day' },
        { field: 'priority', headerName: 'Priority' },
        { field: 'assing_to', headerName: 'Assing To' },
        // {
        //   field: 'vendor_id', headerName: 'Vendor', renderCell: (params) => {
        //     return params.row.vendors.name
        //   }
        // },
        // {field: 'status', headerName: 'Status'},
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
                    <BasicTable title='Picking Task' data={[]} columns={pickingColumns} createForm={<PickingForm />} createFormTitle='Create Picking Task' />
                </Block>
            </Grid>
        </Grid>
    </Box>
  )
}

export default Picking
