'use client'
import React, { useState } from 'react'
import { Avatar, Box, Collapse, IconButton, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { MenuItem } from '../../utils/interfaces';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import WidgetsIcon from '@mui/icons-material/Widgets';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';

const SideBar = ({ open, setOpen }: { open: boolean, setOpen: (status: boolean) => void }) => {

    const MenuList: MenuItem[] = [
        {
            id: 1,
            title: "Dashboard",
            to: "/dashboard",
            icon: <DashboardIcon />
        },
        {
            id: 2,
            title: "Inventory",
            to: "/inventory",
            icon: <InventoryIcon />
        },
        // {
        //   id: 3,
        //   title: "Movements",
        //   to: "",
        //   icon: <WidgetsIcon />,
        //   submenu: [
        //     ...(session?.user?.roleId === 1 || session?.user?.roleId === 2 || session?.user?.roleId === 7 ? [
        //       {
        //         id: 1,
        //         title: "Shipping",
        //         to: "/shipping",
        //         icon: <LocalShippingIcon />
        //       }
        //     ] : []),
        //     ...(session?.user?.roleId === 1 || session?.user?.roleId === 2 || session?.user?.roleId === 7 ? [
        //       {
        //         id: 2,
        //         title: "Receiving",
        //         to: "/receiving",
        //         icon: <ReceiptLongIcon />
        //       }
        //     ] : []),
        //     {
        //       id: 3,
        //       title: "Organize",
        //       to: "/organize",
        //       icon: <OpenWithIcon />
        //     }
        //   ]
        // },
        // ...(session?.user?.roleId === 1 || session?.user?.roleId === 2 || session?.user?.roleId === 8 ? [
        //   {
        //     id: 4,
        //     title: "Orders",
        //     to: "/orders",
        //     icon: <DvrIcon />
        //   }
        // ] : []),
        // ...(session?.user?.roleId === 1 || session?.user?.roleId === 2 || session?.user?.roleId === 8 ? [
        //   {
        //     id: 5,
        //     title: "Return",
        //     to: "/returns",
        //     icon: <UndoIcon />
        //   }
        // ] : []),
        // ...(session?.user?.roleId === 1 || session?.user?.roleId === 2 || session?.user?.roleId === 8 ? [
        //   {
        //     id: 6,
        //     title: "Customers",
        //     to: "/customers",
        //     icon: <Groups2Icon />
        //   }
        // ] : []),
        // ...(session?.user?.roleId === 1 || session?.user?.roleId === 2 ? [
        //   {
        //     id: 7,
        //     title: "Users",
        //     to: "/users",
        //     icon: <GroupIcon />
        //   }
        // ] : [])
    ];

    const [menuOpen, setMenuOpen] = useState<number | null>(1);

    const handleOpenMenu = (key: number) => {
        setMenuOpen(key !== menuOpen ? key : null);
    }

    return (
        <Box sx={{width: open ? "10%" : "3%", height: '100vh', transition: "all .2s ease-in-out", display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0'}} className="transparent-blur-container">
            <IconButton LinkComponent={Link} href='/dashboard' onClick={() => setOpen(false)}>
            <Avatar
              sx={{transition: 'all .2s ease-in-out', width: open ? 80 : 50, height: open ? 80 : 50, '& > img': { objectPosition: 'bottom' } }}
              alt='profile'
              src='/static/img/logos/vibehub-logo-black.png'
            />
          </IconButton>
            <List disablePadding>
                {MenuList.map(item => (
                    <Box key={item.id} sx={{margin: '10px 0'}}>
                        <ListItemButton
                            key={item.id}
                            href={item.to}
                            LinkComponent={Link}
                            selected={menuOpen === item.id}
                            onClick={() => {
                                handleOpenMenu(item.id);
                                setOpen(item.submenu ? true : false);
                            }}
                        >
                            <ListItemIcon sx={{justifyContent: 'center'}}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.title} sx={{ display: open ? 'block' : 'none', transition: 'all 1s ease-in-out'}} />
                            {item.submenu ? menuOpen === item.id ? <ExpandLess /> : <ExpandMore /> : <></>}
                        </ListItemButton>
                        <Collapse in={item.id === menuOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {item.submenu?.map(subItem => (
                                    <ListItemButton
                                        key={subItem.id}
                                        sx={{ pl: 4 }}
                                        href={subItem.to}
                                        LinkComponent={Link}
                                    >
                                        <ListItemIcon>
                                            {subItem.icon}
                                        </ListItemIcon>
                                        <ListItemText primary={subItem.title} />
                                    </ListItemButton>
                                ))}
                            </List>
                        </Collapse>
                    </Box>
                ))}
            </List>
        </Box>
    )
}

export default SideBar
