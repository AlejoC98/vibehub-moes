'use client'
import { Box } from '@mui/material'
import React, { useContext, useEffect } from 'react'
import Grid from '@mui/material/Grid2'
import { Block } from '@/style/global'
import BasicTable from '@/components/tables/basic_table'
import { GridColDef } from '@mui/x-data-grid'
import { GlobalContext } from '@/utils/context/global_provider'
import UsersForms from '@/components/forms/users_form'
import { convertTimeByTimeZone } from '@/utils/functions/main'

const Users = () => {

    const { users, userAccount, setIsLaunching } = useContext(GlobalContext);

    const columns: GridColDef[] = [
        { field: 'username', headerName: 'Username'},
        { field: 'first_name', headerName: 'Firstname'},
        { field: 'last_name', headerName: 'Lastname'},
        { field: 'created_at', headerName: 'Created At', renderCell: (params) => {
          return convertTimeByTimeZone(userAccount?.sessionTimeZone!, params.row.created_at);
        }},
        // { field: 'role_id', headerName: 'Role', renderCell: (params: any) => {
        //     return params.row.roles.name
        // }},
        // { field: 'deleted', headerName: 'Status', renderCell: (params) => (
        //   <Box className={`${params.row.deleted ? 'bg-red-800' : 'bg-green-800'} text-white px-2 py-1 rounded-lg`}>{params.row.deleted ? 'Inactive' : 'Active'}</Box>
        // )}
      ];

  useEffect(() => {
    setIsLaunching(false);
  }, [])

  return (
    <Box>
    <Grid container spacing={2}>
      <Grid size={12}>
        <Block>
          <BasicTable title="Current Users" data={users || []} columns={columns} createForm={<UsersForms />} createFormTitle="Invite User" source='accounts' />
        </Block>
      </Grid>
    </Grid>
  </Box>
  )
}

export default Users