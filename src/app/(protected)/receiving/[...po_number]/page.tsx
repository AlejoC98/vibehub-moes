'use client'
import { Box, Typography } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { GlobalContext } from '@/utils/context/global_provider'
import ReceivingTask from '@/components/tasks/receiving_task'
import { useParams } from 'next/navigation'
import { ReceivingContent } from '@/utils/interfaces'
import PutAwayTask from '@/components/tasks/put_away_task'
import Grid from '@mui/material/Grid2'
import Block from '@/components/block';

const ReceivingDetails = () => {

    const params = useParams();
    const [receivingData, setReceivingData] = useState<ReceivingContent>();
    const { receivings } = useContext(GlobalContext);

    const getRecivingData = async (po_number: string) => {
        const findRe = receivings?.find(re => re.po_number == po_number);

        setReceivingData(findRe);
    }

    useEffect(() => {
        getRecivingData(params['po_number']![0]);
    }, []);

    return (
        <Box>
            { receivingData?.status == 'New' && (
                <ReceivingTask data={receivingData} updateData={setReceivingData} />
            )}
            { receivingData?.status == 'Put Away' && (
                <PutAwayTask data={receivingData} updateData={setReceivingData} />
            )}
            {receivingData?.status == 'Completed' && (
                <Grid container spacing={2}>
                    <Grid size={12}>
                        <Block sx={{ display: 'grid', placeItems: 'center'}}>
                            <Typography variant='h5'>This Receiving is completed!</Typography>
                        </Block>
                    </Grid>
                </Grid>
            )}
        </Box >
    )
}

export default ReceivingDetails
