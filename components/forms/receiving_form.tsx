import { Box, Checkbox, IconButton, InputAdornment, List, ListItem, ListItemButton, ListItemIcon, ListItemText, TextField, Typography } from '@mui/material'
import React, { useContext, useEffect, useRef, useState } from 'react'
import Grid from '@mui/material/Grid2'
import { GlobalContext } from '../../utils/context/global_provider'
import { ProductContent } from '../../utils/interfaces'
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

const ReceivingForm = () => {

    const { products } = useContext(GlobalContext);
    const [checked, setChecked] = useState([0]);
    const [searchData, setSearchData] = useState<ProductContent[]>([]);
    const [receivingProducts, setReceivingProducts] = useState<ProductContent[]>([]);
    const serachRef = useRef<HTMLInputElement | null>(null);

    const handleToggle = (value: number) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            // setReceivingProducts(receivingProducts.push(searchData[currentIndex]));
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const handleSearch = (key: string) => {
        if (key !== "") {
            key = key.toLowerCase();
            const search = products!.filter(row => Object.values(row).find(record => record?.toString().toLowerCase().includes(key)));
            setSearchData(search);
        } else {
            setSearchData([]);
        }
    }

    const handleCleanSearch = () => {
        setSearchData(products!);
        serachRef.current!.querySelector('input')!.value = "";
    }

    useEffect(() => {
        setSearchData(products!);
    }, []);

    return (
        <Box sx={{ flexGrow: 1, padding: 5 }}>
            <form action="">
                <Grid container spacing={5}>
                    <Grid size={6}>
                        <TextField
                            fullWidth
                            required
                            disabled
                            label="PO Number"
                        />
                    </Grid>
                    <Grid size={6}>
                        <TextField
                            fullWidth
                            required
                            disabled
                            label="Vendor"
                        />
                    </Grid>
                    <Grid size={6}>
                        <TextField
                            fullWidth
                            required
                            disabled
                            label="Arrived Date"
                        />
                    </Grid>
                    <Grid size={6}>
                        <TextField
                            fullWidth
                            required
                            disabled
                            label="Trailer Number"
                        />
                    </Grid>
                    <Grid size={12}>
                        <Typography align='center'>Items</Typography>
                        <Box>
                            <TextField
                                fullWidth
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder='Search'
                                ref={serachRef}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                {searchData.length > 0 && (
                                                    <IconButton onClick={handleCleanSearch}>
                                                        <CloseIcon />
                                                    </IconButton>
                                                )}
                                            </InputAdornment>
                                        )
                                    }
                                }}
                            />
                        </Box>
                        <Box sx={{ maxHeight: 300, overflowY: 'scroll' }}>
                            <List>
                                {searchData?.map(item => {
                                    const labelId = `checkbox-list-label-${item.id}`;
                                    return (
                                        <ListItem key={item.id}>
                                            <ListItemButton role={undefined} onClick={handleToggle(item.id!)} dense>
                                                <ListItemIcon>
                                                    <Checkbox
                                                        edge="start"
                                                        checked={checked.includes(item.id!)}
                                                        tabIndex={-1}
                                                        disableRipple
                                                        slotProps={{
                                                            input: {
                                                                'aria-labelledby': labelId
                                                            }
                                                        }}
                                                    />
                                                </ListItemIcon>
                                                <ListItemText id={labelId} primary={item.name} />
                                            </ListItemButton>
                                        </ListItem>
                                    )
                                })}
                            </List>
                        </Box>
                    </Grid>
                </Grid>
            </form>
        </Box>
    )
}

export default ReceivingForm
