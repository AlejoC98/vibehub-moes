'use client'
import { Badge, Box, Divider, IconButton, InputAdornment, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Toolbar, Typography, useMediaQuery, useTheme } from '@mui/material'
import React, { MouseEvent, useContext, useEffect, useRef, useState } from 'react'
import { Search, SearchIconWrapper, StyledInputBase, VibeNavbar } from '@/style/global'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import { signout } from '@/app/(public)/auth/login/actions'
import { GlobalContext } from '@/utils/context/global_provider'
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import { useRouter } from 'next/navigation'
import { NotificationContent } from '@/utils/interfaces'
import { createClient } from '@/utils/supabase/client'

const Navbar = ({ open, setOpen, menuOpen, setMenuOpen }: { open: boolean, setOpen: (status: boolean) => void, menuOpen: number | null, setMenuOpen: (status: number | null) => void}) => {

    const router = useRouter();
    const supabase = createClient();
    const { notifications, setIsLaunching, userAccount } = useContext(GlobalContext);
    const searchRef = useRef<HTMLInputElement>(null);
    const menuId = 'primary-search-account-menu';
    const [pendingNotifcation, setPendingNotification] = useState<number>(0);
    const [anchorNoti, setAnchorNoti] = useState<null | HTMLElement>(null);
    const [anchorSett, setAnchorSett] = React.useState<null | HTMLElement>(null);
    const isMenuOpen = Boolean(anchorNoti);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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

    const handleOpenSettMenu = (redirectTo: string) => {
        setMenuOpen(null);
        handleSettingsClose();
        setIsLaunching(true);
        router.push(redirectTo);
    }

    const handleOpenNoti = async(noti: NotificationContent) => {
        setAnchorNoti(null);
        setMenuOpen(null);
        await supabase.from('notifications').update({'status': 'Opened'}).eq('id', noti.id);
        router.push(noti.redirect_to);
    }

    const handleLogOut = () => {
        setIsLaunching(true);
        handleSettingsClose();
        signout();
    }

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
            <MenuItem onClick={() => handleOpenSettMenu('/profile')}>Profile</MenuItem>
            <MenuItem onClick={handleLogOut}>Log Out</MenuItem>
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
            {notifications?.map(noti => (
                <ListItemButton key={noti.id} onClick={() => handleOpenNoti(noti.notifications)}>
                    <ListItemIcon>
                        <Box>
                            {noti.notifications.status === "New" ? <AddIcon /> : noti.notifications.status === "update" ? <AutorenewIcon /> : noti.notifications.status === "delete" ? <DeleteIcon /> : <PriorityHighIcon />}
                        </Box>
                    </ListItemIcon>
                    <ListItemText primary={noti.notifications.title} secondary={noti.notifications.text} />
                </ListItemButton>
            ))}
            {notifications?.length === 0 && (
                <MenuItem disabled>
                    <ListItemText primary="Nothing yet!" />
                </MenuItem>
            )}
            <Divider />
            <MenuItem>
                <ListItemText className="text-center">See All</ListItemText>
            </MenuItem>
        </Menu>
    )

    useEffect(() => {
        if (notifications?.length! > 0) {
            const totalNewNotifications = notifications!.filter(
                item => item.notifications?.status === 'New'
              ).length;
            
              setPendingNotification(totalNewNotifications);
        }
    }, [notifications])

    return (
        <VibeNavbar position='static'>
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    sx={{ mr: 2 }}
                    onClick={() => {
                        setOpen(!open)
                    }}
                >
                    <MenuIcon />
                </IconButton>
                { !isMobile && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 5}}>
                        <Box sx={{ display: { xl: 'flex', lg: 'flex', md: 'none', sm: 'none', xs: 'none'}, placeItems: 'center', gap: 1 }}>
                            <Typography variant='h6' fontWeight='bold'>Good morning</Typography>
                            <Typography variant='h6' fontWeight='bold' sx={{ textTransform: 'capitalize' }}>{ userAccount?.username?.toLocaleLowerCase() }</Typography>
                        </Box>
                        <Typography
                            sx={{ display: { xl: 'block', lg: 'block', md: 'none', sm: 'none', xs: 'none'}}}>
                            Check your shifts, track your tasks, stay in control.
                        </Typography>
                    </Box>
                ) }
                <Box sx={{ flexGrow: .5 }} />
                <Search sx={{ width: isMobile ? 'none' : '100%' }}>
                    <SearchIconWrapper>
                        <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                        sx={{ width: isMobile ? '20ch' : '40ch' }}
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
                                    <CloseIcon fontSize='small' sx={{ color: '#FFFFFF'}} />
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </Search>
                <Box sx={{ flexGrow: 1 }} />
                <Box
                    sx={{ display: 'flex', placeItems: 'center', justifyContent: 'space-between', gap: 3}}
                >
                    <IconButton
                        size="large"
                        edge="end"
                        aria-label="account of current user"
                        aria-controls={menuId}
                        aria-haspopup="true"
                        onClick={handleMenuOpen}
                    >
                        <Badge badgeContent={pendingNotifcation} color='error'>
                            <NotificationsIcon sx={{ color: '#FFFFFF'}} />
                        </Badge>
                    </IconButton>
                    {renderNotiMenu}
                    <IconButton onClick={handleSettMenu}>
                        <SettingsIcon sx={{ color: '#FFFFFF'}} />
                    </IconButton>
                    {renderSettingMenu}
                </Box>
            </Toolbar>
        </VibeNavbar>
    )
}

export default Navbar
