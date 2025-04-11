'use client'
import React, { MouseEvent, useEffect, useState } from 'react'
import { Box, IconButton, InputAdornment, List, ListItem, ListItemButton, ListItemText, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { PickListContent } from '@/utils/interfaces';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

const SearchPickList = ({ data }: { data: PickListContent[]}) => {

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
            <Grid container spacing={5}>
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
                <Grid size={activePick != null ? 6 : 12}>
                    <List>
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
                            </ListItemButton>
                        ))}
                    </List>
                </Grid>
                {activePick && (
                    <Grid size={6}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: 300, overflowY: 'auto', paddingRight: 1}}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', placeItems: 'center'}}>
                                <Box>
                                    <Typography fontWeight='bold'>PL #</Typography>
                                    <Typography>{ data[activePick].pl_number}</Typography>
                                </Box>
                                <Box>
                                    <Typography fontWeight='bold'>BOL #</Typography>
                                    <Typography>{ data[activePick].bol_number}</Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', placeItems: 'center'}}>
                                <Box>
                                    <Typography fontWeight='bold'>Picker</Typography>
                                    <Typography>{ data[activePick].picker_name}</Typography>
                                </Box>
                                <Box>
                                    <Typography fontWeight='bold'>Verified By</Typography>
                                    <Typography>{ data[activePick].verified_by}</Typography>
                                </Box>
                            </Box>
                            <Typography fontWeight='bold'>Total Products: { data[activePick].total_products}</Typography>
                            <List sx={{ background: '#eaeaea'}}>
                                {data[activePick]?.shippings_products.map((p, index) => (
                                    <ListItem key={index}>
                                        <ListItemText primary={`Sku ${p.product_sku}`} secondary={`Quantity: ${p.product_quantity}`} />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    </Grid>
                )}
            </Grid>
        </Box>
    )
}

export default SearchPickList
