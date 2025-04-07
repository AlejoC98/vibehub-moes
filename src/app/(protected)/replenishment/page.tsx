'use client'
import { Box } from '@mui/material'
import React, { useContext, useEffect } from 'react'
import Grid from '@mui/material/Grid2';
import ReplenishmentTask from '@/components/tasks/replenishment_task';
import { Block } from '@/style/global';
import { GlobalContext } from '@/utils/context/global_provider';

const Replenishment = () => {

  const { setIsLaunching } = useContext(GlobalContext);

  useEffect(() => {
    setIsLaunching(false);
  }, []);

  return (
    <Box>
        <Grid container spacing={2}>
            <Grid size={12}>
                <Block>
                    <ReplenishmentTask />
                </Block>
            </Grid>
        </Grid>
    </Box>
  )
}

export default Replenishment
