'use client'
import { Box } from '@mui/material'
import React, { useContext, useEffect } from 'react'
import Grid from '@mui/material/Grid2'
import { GlobalContext } from '../../../../utils/context/global_provider'
import { Block } from '../../../../style/global'
import BasicTable from '../../../../components/tables/basic_table'
import { GridColDef } from '@mui/x-data-grid'
import CarrierForm from '../../../../components/forms/carrier_form'

const Carries = () => {

  const { carriers, setIsLaunching } = useContext(GlobalContext);

  const carriersColumns: GridColDef[] = [
    { field: 'id', headerName: 'ID' },
    { field: 'name', headerName: 'Name' },
    // { field: 'deleted', headerName: 'Status', renderCell: (params) => (
    //   <Box className={`${params.row.deleted ? 'bg-red-800' : 'bg-green-800'} text-white px-2 py-1 rounded-lg`}>{params.row.deleted ? 'Inactive' : 'Active'}</Box>
    // )}
  ];

  useEffect(() => {
    setIsLaunching(false);
  }, []);

  return (
    <Box>
      <Grid container spacing={5}>
        <Grid size={12}>
          <Block>
            <BasicTable title='Carriers' data={carriers || []} columns={carriersColumns} createForm={<CarrierForm />} createFormTitle='Create Carrier' />
          </Block>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Carries
