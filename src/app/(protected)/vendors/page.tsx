'use client'
import { Box } from '@mui/material'
import React, { useContext, useEffect } from 'react'
import Grid from '@mui/material/Grid2'
import Block from '@/components/block';
import BasicTable from '@/components/tables/basic_table'
import { GlobalContext } from '@/utils/context/global_provider'
import { GridColDef } from '@mui/x-data-grid'
import VendorsForm from '@/components/forms/vendors_form'

const Vendors = () => {

    const { vendors, setIsLaunching } = useContext(GlobalContext);

    const vendorsColumns: GridColDef[] = [
        { field: 'name', headerName: 'Name'},
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
                    <BasicTable title='Vendors' data={vendors || []} columns={vendorsColumns} createForm={<VendorsForm />} createFormTitle="New Vendor" />
                </Block>
            </Grid>
        </Grid>
    </Box>
  )
}

export default Vendors
