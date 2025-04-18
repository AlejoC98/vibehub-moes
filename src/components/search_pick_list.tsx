'use client'
import React, { MouseEvent, useEffect, useState } from 'react'
import { Box, Button, IconButton, InputAdornment, List, ListItem, ListItemButton, ListItemText, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { PickListContent } from '@/utils/interfaces';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import Link from 'next/link';
import { usePathname } from 'next/navigation';


function renderStatusContainer(status: string) {
    switch (status) {
              case 'Pending':
                return <Box sx={{color: "#FFFFFF", height: '100%', display: 'grid', placeItems: 'center'}}>
                  <Typography sx={{ background: '#FFE082', padding: '.5px 2px', borderRadius: 1 }}>{status}</Typography>
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
              default:
                return <Box sx={{or: "#FFFFFF", height: '100%', display: 'grid', placeItems: 'center'}}>
                  <Typography sx={{ background: '#EEE', padding: '.5px 2px', borderRadius: 1 }}>{status}</Typography>
                </Box>;
            }
}

const SearchPickList = ({ data }: { data: PickListContent[] }) => {

    const pathname = usePathname();
    const [keyword, setKeyWord] = useState<string>('');
    const [activePick, setActivePick] = useState<number>();
    const [displayData, setDisplayData] = useState<PickListContent[]>();

    const handleSearch = () => {
        if (keyword == '' || keyword == null) {
            setDisplayData(data);
        } else {
            const matches = data.filter(item =>
                Object.values(item).some(value =>
                    String(value).toLowerCase().includes(keyword.toLowerCase())
                )
            );

            setDisplayData(matches);
        }
    }
    const handleCleanSearch = () => {
        setKeyWord('');
        setDisplayData(data);
    }

    useEffect(() => {
        setDisplayData(data);
    }, [data])

    return (
        <Box>
            <Grid container spacing={1}>
                <Grid size={12}>
                    <TextField
                        fullWidth
                        placeholder='Search...'
                        value={keyword}
                        onChange={(e) => {
                            setKeyWord(e.target.value);
                            handleSearch();
                        }}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position='start' className="text-white">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position='end'>
                                        <IconButton
                                            onClick={handleCleanSearch}
                                        >
                                            <CloseIcon fontSize='small' />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }
                        }}
                    />
                </Grid>
                <Grid size={12}>
                    <Box padding={1}>
                        <Typography variant='h6' fontWeight='bold'>Total Pick Lists: {data?.length}</Typography>
                    </Box>
                </Grid>
                <Grid size={{ xl: activePick != null ? 6 : 12, lg: activePick != null ? 6 : 12, md: 12, sm: 12, xs: 12 }}>
                    <List sx={{ maxHeight: 300, overflowY: 'auto' }}>
                        {displayData?.map((item, index) => (
                            <ListItemButton
                                key={index}
                                selected={index == activePick}
                                sx={{
                                    borderBottom: 1, borderBottomColor: '#c1c1c1', '&.Mui-selected': {
                                        backgroundColor: '#cfcfcf',
                                    },
                                    '&.Mui-selected:hover': {
                                        backgroundColor: '#dcdcdc',
                                    },
                                }} onClick={() => setActivePick(activePick != index ? index : undefined)}>
                                <ListItemText primary={item.pl_number} secondary='PL Number' />
                                {renderStatusContainer(item.status)}
                            </ListItemButton>
                        ))}
                    </List>
                </Grid>
                {activePick != undefined && (
                    <Grid size={{ xl: 6, lg: 6, md: 12, sm: 12, xs: 12 }} sx={{ maxHeight: 300, overflowY: 'auto' }}>
                        <Grid container spacing={2}>
                            <Grid size={12}>
                                <Button LinkComponent={Link} href={`${pathname}/${data[activePick].pl_number}`} fullWidth className='btn-munsell'>Start Pick</Button>
                            </Grid>
                            <Grid size={6}>
                                <Typography fontWeight='bold'>PL #</Typography>
                                <Typography>{data[activePick].pl_number}</Typography>
                            </Grid>
                            <Grid size={6}>
                                <Typography fontWeight='bold'>BOL #</Typography>
                                <Typography>{data[activePick].bol_number}</Typography>
                            </Grid>
                            <Grid size={6}>
                                <Typography fontWeight='bold'>Picker</Typography>
                                <Typography>{data[activePick].picker_name}</Typography>
                            </Grid>
                            <Grid size={6}>
                                <Typography fontWeight='bold'>Verified By</Typography>
                                <Typography>{data[activePick].verified_by}</Typography>
                            </Grid>
                            <Grid size={12}>
                                <Typography variant='h6' fontWeight='bold'>Notes</Typography>
                                <Typography>{data[activePick].notes}</Typography>
                            </Grid>
                            <Grid size={12}>
                                <Typography fontWeight='bold'>Total Products: {data[activePick].total_products}</Typography>
                            </Grid>
                            <Grid size={12}>
                                <List sx={{ background: '#eaeaea' }}>
                                    {data[activePick]?.shippings_products.map((p, index) => (
                                        <ListItem key={index}>
                                            <ListItemText primary={`Sku ${p.product_sku}`} secondary={`Quantity: ${p.product_quantity}`} />
                                        </ListItem>
                                    ))}
                                </List>
                            </Grid>
                        </Grid>
                    </Grid>
                )}
            </Grid>
        </Box>
    )
}

export default SearchPickList
