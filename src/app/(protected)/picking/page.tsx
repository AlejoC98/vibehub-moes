'use client'
import { Box, Button } from '@mui/material'
import React, { ReactElement, ReactNode, useContext, useEffect } from 'react'
import Grid from '@mui/material/Grid2';
import Block from '@/components/block';
import BasicTable from '@/components/tables/basic_table';
import PickingForm from '@/components/forms/picking/picking_form';
import { GridColDef } from '@mui/x-data-grid';
import { GlobalContext } from '@/utils/context/global_provider';
import { generateRandomNumberString } from '@/utils/functions/main';
import { useRouter } from 'next/navigation';

const Picking = () => {

  const { setIsLaunching, pickingTasks, userAccount } = useContext(GlobalContext);
  const route = useRouter();

  const pickingColumns: GridColDef[] = [
    { field: 'pick_number', headerName: 'Pick #' },
    { field: 'status', headerName: 'Status' },
    { field: 'created_by', headerName: 'Created By' },
  ];

  const handleQuickPick = async () => {
    const newPlId: string = generateRandomNumberString(6);

    setIsLaunching(true);
    route.push(`/picking/${newPlId}`);
  }

  const actionButtons: ReactElement<any>[] = userAccount?.accounts_roles?.find((r) => [1,2,3,5,7].includes(r.role_id)) ? [
    <Box key="quick-pick" sx={{ display: 'flex', justifyContent: 'end' }}>
      <Button variant='contained' className='btn-munsell' onClick={handleQuickPick}>Quick Pick</Button>
    </Box>
  ] : [];

  useEffect(() => {
    setIsLaunching(false);
  }, []);

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid size={12}>
        </Grid>
        <Grid size={12}>
          <Block>
            <BasicTable title='Picking Task' data={pickingTasks || []} columns={pickingColumns} actionButtons={actionButtons} />
          </Block>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Picking
