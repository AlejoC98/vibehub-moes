import React from 'react'
import { Block } from '../style/global'
import { Typography } from '@mui/material'

const UpgradePlan = () => {
    return (
        <Block sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', placeItems: 'center', gap: 2 }}>
            <img src="/static/img/upgrade-logo.png" alt="" />
            <Typography sx={{ fontSize: '3rem' }} fontWeight='bold'>Unlock More Content</Typography>
            <Typography sx={{ fontSize: '1.3rem' }}>To access this feature, please upgrade your plan. Get more storage, features, and flexibility with a higher tier.</Typography>
        </Block>
    )
}

export default UpgradePlan
