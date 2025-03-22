'use client'
import { Badge, Box, Divider, IconButton, InputAdornment, ListItemText, Menu, MenuItem, Toolbar, Typography } from '@mui/material'
import React, { MouseEvent, useRef, useState } from 'react'
import { Search, SearchIconWrapper, StyledInputBase, VibeNavbar } from '../../style/global'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search';
import EmailIcon from '@mui/icons-material/Email';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import DeleteIcon from '@mui/icons-material/Delete';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import { signout } from '@/app/(public)/auth/login/actions'
// import { createClient } from '../../utils/supabase/client';

const Navbar = ({ open, setOpen }: { open: boolean, setOpen: (status: boolean) => void }) => {

    // const supabase = createClient();

    const searchRef = useRef<HTMLInputElement>(null);
    const menuId = 'primary-search-account-menu';
    const [closedNotifcation, setClosedNotification] = useState<number>(0);
    const [anchorNoti, setAnchorNoti] = useState<null | HTMLElement>(null);
    const [anchorSett, setAnchorSett] = React.useState<null | HTMLElement>(null);
    const isMenuOpen = Boolean(anchorNoti);

    const handleSearch = () => {
        console.log('sisa');
    };

    const handleCleanSearch = () => {
        console.log('socio');
    }

    const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
        setAnchorNoti(event.currentTarget);
    }

    const handleSettMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorSett(event.currentTarget);
      };

    const handleMenuClose = () => {
        setAnchorNoti(null);
    }

    const handleSettingsClose = () => {
        setAnchorSett(null);
      };

    const renderSettingMenu = (
        <Menu
                id="menu-appbar"
                anchorEl={anchorSett}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorSett)}
                onClose={handleSettingsClose}
              >
                <MenuItem onClick={handleSettingsClose}>Profile</MenuItem>
                <MenuItem onClick={() => signout()}>Log Out</MenuItem>
              </Menu>
    );

    const renderNotiMenu = (
        <Menu
            anchorEl={anchorNoti}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
            }}
            id={menuId}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            {/* {notifications?.map(noti => (
                <MenuItem key={noti.id} onClick={() => handleOpenNotification(noti)} sx={{ width: '15rem', backgroundColor: noti.usernotificationstatus[0].open ? '#FFFFFF' : '#E6E9EA' }}>
                    <ListItemIcon>
                        <Box sx={{ backgroundColor: noti.icon === "new" ? '#09A0DB' : noti.icon === "update" ? '#FDBA1A' : noti.icon === "delete" ? "#F16865" : "#eee", borderRadius: '50%', padding: .4, color: "#ffffff" }}>
                            {noti.icon === "new" ? <AddIcon /> : noti.icon === "update" ? <AutorenewIcon /> : noti.icon === "delete" ? <DeleteIcon /> : <PriorityHighIcon />}
                        </Box>
                    </ListItemIcon>
                    <ListItemText primary={noti.title} secondary={noti.content} />
                </MenuItem>
            ))}
            {notifications?.length === 0 && (
                <MenuItem disabled>
                    <ListItemText primary="Nothing yet!" />
                </MenuItem>
            )} */}
            <Divider />
            <MenuItem>
                <ListItemText className="text-center">See All</ListItemText>
            </MenuItem>
        </Menu>
    )

    return (
        <Box>
            <VibeNavbar position='static'>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        sx={{ mr: 2 }}
                        onClick={() => setOpen(!open)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Box sx={{ flexGrow: .4 }} />
                    <Box>
                        <Typography
                            variant='h5'
                            noWrap
                            component="div"
                            sx={{ display: { xs: 'none', sm: 'block' } }}
                            style={{ textTransform: 'capitalize' }}
                        >
                            {/* {session?.user?.name} */}
                        </Typography>
                        <Typography className="text-sm">Welcome Back!</Typography>
                    </Box>
                    <Box sx={{ flexGrow: 1 }} />
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search.."
                            inputProps={{ 'aria-label': 'search' }}
                            onChange={handleSearch}
                            ref={searchRef}
                            className="w-full"
                            endAdornment={
                                <InputAdornment position='end'>
                                    <IconButton
                                        onClick={handleCleanSearch}
                                        sx={{ opacity: searchRef.current?.querySelector('input')!.value !== "" ? 1 : 0 }}
                                    >
                                        <CloseIcon fontSize='small' />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        {/* {foundData.length > 0 && (
                            <Box className="absolute w-full bg-white p-2 z-50 max-h-[11rem] overflow-y-scroll rounded">
                                <List component="nav">
                                    {foundData?.map(ele => (
                                        <ListItemButton key={ele.id} onClick={() => handleOpen(ele)}>
                                            <ListItemText
                                                primary={
                                                    'name' in ele ?
                                                        'position' in ele ?
                                                            `Rack ${ele.name}` :
                                                            ele.name :
                                                        'account' in ele ?
                                                            ele.account !== null ?
                                                                `${ele.account!.firstname!} ${ele.account!.lastname!}` :
                                                                ele.username :
                                                            'addresses' in ele ?
                                                                `${ele.firstname} ${ele.lastname}` :
                                                                ''
                                                }
                                                secondary={
                                                    'sku' in ele && 'unit_price' in ele ? `Sku - ${ele.sku}` :
                                                        'rows' in ele && 'columns' in ele ? `Rows ${ele.rows} - Columns ${ele.columns}` :
                                                            'account' in ele && ele.account !== null ? `Username - ${ele.username}` :
                                                                'role' in ele ? `Role ${ele.role!.name}` :
                                                                    'addresses' in ele ? "Customer" : ''
                                                }
                                            />
                                        </ListItemButton>
                                    ))}
                                </List>
                            </Box>
                        )} */}
                    </Search>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box className="flex items-center justify-between w-[9%] mr-[5rem]">
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleMenuOpen}
                        >
                            <Badge badgeContent={closedNotifcation} color='error'>
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        {renderNotiMenu}
                        <IconButton>
                            <EmailIcon />
                        </IconButton>
                        <IconButton onClick={handleSettMenu}>
                            <SettingsIcon />
                        </IconButton>
                        {renderSettingMenu}
                    </Box>
                </Toolbar>
            </VibeNavbar>
        </Box>
    )
}

export default Navbar
