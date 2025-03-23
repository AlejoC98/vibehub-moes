import { Box } from '@mui/material'
import React from 'react'
import Grid from '@mui/material/Grid2';
import ReplenishmentTask from '../../../../components/tasks/replenishment_task';
import { Block } from '../../../../style/global';

const Replenishment = () => {
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
