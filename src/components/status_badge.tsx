import { Box, Typography } from '@mui/material';
import React from 'react'

const StatusBadge = ({ status } : { status: string }) => {
    switch (status) {
        case 'Pending':
          return <Box sx={{color: "#FFFFFF", height: '100%', display: 'grid', placeItems: 'center'}}>
            <Typography sx={{ background: '#FFE082', padding: '.5px 2px', borderRadius: 1 }}>{status}</Typography>
          </Box>;
        case 'Awaiting Verification':
          return <Box sx={{color: "#FFFFFF", height: '100%', display: 'grid', placeItems: 'center'}}>
            <Typography sx={{ background: '#407899', padding: '.5px 2px', borderRadius: 1 }}>{status}</Typography>
          </Box>;
        case 'Processing':
          return <Box sx={{color: "#FFFFFF", height: '100%', display: 'grid', placeItems: 'center'}}>
            <Typography sx={{ background: '#64B5F6', padding: '.5px 2px', borderRadius: 1 }}>{status}</Typography>
          </Box>;
        case 'Shipped':
          return <Box sx={{color: "#FFFFFF", height: '100%', display: 'grid', placeItems: 'center'}}>
            <Typography sx={{ background: '#242f40', padding: '.5px 2px', borderRadius: 1 }}>{status}</Typography>
          </Box>;
        case 'Delivered':
          return <Box sx={{color: "#FFFFFF", height: '100%', display: 'grid', placeItems: 'center'}}>
            <Typography sx={{ background: '#81C784', padding: '.5px 2px', borderRadius: 1 }}>{status}</Typography>
          </Box>;
        case 'Cancelled':
          return <Box sx={{color: "#FFFFFF", height: '100%', display: 'grid', placeItems: 'center'}}>
            <Typography sx={{ background: '#E57373', padding: '.5px 2px', borderRadius: 1 }}>{status}</Typography>
          </Box>;
        case 'Completed':
          return <Box sx={{color: "#FFFFFF", height: '100%', display: 'grid', placeItems: 'center'}}>
            <Typography sx={{ background: '#81C784', padding: '.5px 2px', borderRadius: 1 }}>{status}</Typography>
          </Box>;
        default:
          return <Box sx={{or: "#FFFFFF", height: '100%', display: 'grid', placeItems: 'center'}}>
            <Typography sx={{ background: '#EEE', padding: '.5px 2px', borderRadius: 1 }}>{status}</Typography>
          </Box>;
      }
}

export default StatusBadge
