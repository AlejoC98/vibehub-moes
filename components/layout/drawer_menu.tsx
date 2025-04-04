'use client'
import { Box, Collapse, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import React, { Fragment, useContext, useState } from 'react'
import { GlobalContext } from '../../utils/context/global_provider';
import { useRouter } from 'next/navigation';
import { MenuItem } from '../../utils/interfaces';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import InventoryIcon from '@mui/icons-material/Inventory';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ChecklistIcon from '@mui/icons-material/Checklist';
import OpenWithIcon from '@mui/icons-material/OpenWith';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import UndoIcon from '@mui/icons-material/Undo';
import DvrIcon from '@mui/icons-material/Dvr';
import Swal from 'sweetalert2';

const DrawerMenu = ({ openDrawer, toggleDrawer }: { openDrawer: boolean, toggleDrawer: (status: boolean) => void }) => {

    const { userAccount } = useContext(GlobalContext);

    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState<number | null>(1);

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
            to: "#",
            icon: <InventoryIcon />
        },
        {
            id: 3,
            title: "Logistics",
            to: "#",
            icon: <AssignmentIcon />,
            submenu: [
                ...(userAccount?.role?.id === 1 || userAccount?.role?.id === 2 || userAccount?.role?.id === 3 ? [
                    {
                        id: 1,
                        title: "Shipping",
                        to: "/shipping",
                        icon: <LocalShippingIcon />
                    }
                ] : []),
                ...(userAccount?.role?.id === 1 || userAccount?.role?.id === 2 || userAccount?.role?.id === 3 ? [
                    {
                        id: 2,
                        title: "Receiving",
                        to: "#",
                        icon: <ReceiptLongIcon />
                    }
                ] : []),
                {
                    id: 3,
                    title: "Replenishment",
                    to: "#",
                    icon: <OpenWithIcon />
                },
                {
                    id: 4,
                    title: "Picking",
                    to: "#",
                    icon: <ChecklistIcon />
                }
            ]
        },
        ...(userAccount?.role?.id === 1 || userAccount?.role?.id === 2 || userAccount?.role?.id === 3 ? [
            {
                id: 4,
                title: "Orders",
                to: "#",
                icon: <DvrIcon />
            }
        ] : []),
        ...(userAccount?.role?.id === 1 || userAccount?.role?.id === 2 || userAccount?.role?.id === 3 ? [
            {
                id: 5,
                title: "Return",
                to: "#",
                icon: <UndoIcon />
            }
        ] : []),
        ...(userAccount?.role?.id === 1 || userAccount?.role?.id === 3 ? [
            {
                id: 6,
                title: "Vendors",
                to: "#",
                icon: <StorefrontIcon />
            }
        ] : []),
        ...(userAccount?.role?.id === 1 || userAccount?.role?.id === 3 ? [
            {
                id: 7,
                title: "Users",
                to: "#",
                icon: <GroupIcon />
            }
        ] : []),
    ];

    const handleRedirectMenu = (key: number, direction?: string) => {
        switch (direction) {
            case '#':
                toggleDrawer(false);
                Swal.fire({
                    icon: 'info',
                    title: "Almost There!",
                    html: `This feature isn’t available on your current plan.</br>Reach out to our support team to upgrade and unlock it!`,
                    confirmButtonColor: '#549F93',
                    showClass: {
                        popup: `
                            animate__animated
                            animate__fadeInUp
                            animate__faster
                          `
                    },
                    hideClass: {
                        popup: `
                            animate__animated
                            animate__fadeOutDown
                            animate__faster
                          `
                    }
                });
                break;
            default:
                setMenuOpen(key !== menuOpen ? key : null);
                if (direction != undefined) {
                    toggleDrawer(false);
                    router.push(direction!);
                }
                break;
        }

    }

    return (
        <Fragment key={'bottom'}>
            <Drawer
                anchor='bottom'
                open={openDrawer}
                onClose={() => toggleDrawer(false)}
                ModalProps={{
                    keepMounted: true,
                }}
            >
            {MenuList.map(item => (
                    <Box key={item.id}>
                        {openDrawer ? item.submenu ? <ListItem
                            sx={{ padding: '10px 0' }}
                            secondaryAction={
                                <IconButton
                                    edge="end"
                                    aria-label="expand"
                                    onClick={() => handleRedirectMenu(item.id)}
                                >
                                    {item.submenu ? menuOpen === item.id ? <ExpandLess /> : <ExpandMore /> : <></>}
                                </IconButton>
                            }>
                            <ListItemIcon sx={{ justifyContent: 'center' }}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.title} />
                        </ListItem> : <ListItemButton
                            sx={{ padding: '10px 0', justifyContent: 'center', alignItems: 'center' }}
                            // href={item.to}
                            // LinkComponent={Link}
                            selected={menuOpen === item.id}
                            onClick={() => {
                                handleRedirectMenu(item.id, item.to);
                                // handleOpenMenu(item.id);
                            }}>
                            <ListItemIcon sx={{ justifyContent: 'center' }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.title} />
                        </ListItemButton> : <ListItemButton
                            sx={{ padding: '10px 0', justifyContent: 'center', alignItems: 'center' }}
                            // href={item.to}
                            // LinkComponent={Link}
                            selected={menuOpen === item.id}
                            onClick={() => {
                                handleRedirectMenu(item.id, item.to);
                                // handleOpenMenu(item.id);
                            }}>
                            <ListItemIcon sx={{ justifyContent: 'center' }}>
                                {item.icon}
                            </ListItemIcon>
                        </ListItemButton>}
                        <Collapse in={item.id === menuOpen} timeout="auto" unmountOnExit sx={{ padding: 0, margin: 0 }}>
                            <List component="div" disablePadding sx={{ justifyContent: 'center', alignItems: 'center', background: '#DEDEDE' }}>
                                {item.submenu?.map(subItem => (
                                    <ListItemButton
                                        key={subItem.id}
                                        sx={{ padding: '10px 12px', justifyItems: 'center', alignContent: 'center' }}
                                        // href={subItem.to}
                                        // LinkComponent={Link}
                                        onClick={() => {
                                            handleRedirectMenu(subItem.id, subItem.to)
                                        }}
                                    >
                                        <ListItemIcon>
                                            {subItem.icon}
                                        </ListItemIcon>
                                        {openDrawer && <ListItemText primary={subItem.title} />}
                                    </ListItemButton>
                                ))}
                            </List>
                        </Collapse>
                    </Box>
                ))}
            </Drawer>
        </Fragment>
    )
}

export default DrawerMenu
