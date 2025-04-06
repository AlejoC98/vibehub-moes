'use client'
import React, { useContext, useEffect, useState } from 'react'
import { Avatar, Box, Collapse, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { MenuItem } from '../../utils/interfaces';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Link from 'next/link';
import { GlobalContext } from '../../utils/context/global_provider';
import { usePathname, useRouter } from 'next/navigation';
import { HugeiconsIcon } from '@hugeicons/react';
import { DashboardSquare02Icon, WarehouseIcon, FlowIcon, Trolley02Icon, LiftTruckIcon, PackageMovingIcon, TaskDaily01Icon, ComputerDollarIcon, ReturnRequestIcon, TruckDeliveryIcon, Store02Icon, UserGroupIcon, CustomerService01Icon } from '@hugeicons/core-free-icons';
import Swal from 'sweetalert2';
import 'animate.css';

const SideBar = ({ open, setOpen }: { open: boolean, setOpen: (status: boolean) => void }) => {

    const { userAccount, setIsLaunching } = useContext(GlobalContext);

    const router = useRouter();
    const pathname = usePathname();

    const [menuOpen, setMenuOpen] = useState<number | null>(1);
    const [sideWidth, setSideWidth] = useState<number>(250);

    const MenuList: MenuItem[] = [
        {
            id: 1,
            title: "Dashboard",
            to: "/dashboard",
            icon: <HugeiconsIcon icon={DashboardSquare02Icon} />
        },
        {
            id: 2,
            title: "Inventory",
            to: "/inventory",
            icon: <HugeiconsIcon icon={WarehouseIcon} />
        },
        {
            id: 3,
            title: "Logistics",
            // to: "#",
            icon: <HugeiconsIcon icon={FlowIcon} />,
            submenu: [
                ...(userAccount?.accounts_roles?.some(role => role.role_id === 7) ? [
                    {
                        id: 1,
                        title: "Shipping",
                        to: "/shipping",
                        icon: <HugeiconsIcon icon={Trolley02Icon} />
                    }
                ] : []),
                ...(userAccount?.accounts_roles?.some(role => role.role_id === 8) ? [
                    {
                        id: 2,
                        title: "Receiving",
                        to: "#",
                        icon: <HugeiconsIcon icon={LiftTruckIcon} />
                    }
                ] : []),
                ...(userAccount?.accounts_roles?.some(role => role.role_id === 9) ? [
                    {
                        id: 3,
                        title: "Replenishment",
                        to: "#",
                        icon: <HugeiconsIcon icon={PackageMovingIcon} />
                    },
                ] : []),
                ...(userAccount?.accounts_roles?.some(role => role.role_id === 5) ? [
                    {
                        id: 4,
                        title: "Picking",
                        to: "#",
                        icon: <HugeiconsIcon icon={TaskDaily01Icon} />
                    }
                ] : []),
            ]
        },
        ...(userAccount?.accounts_roles?.some(role => role.role_id === 2 || role.role_id === 3) ? [
            {
                id: 4,
                title: "Orders",
                to: "#",
                icon: <HugeiconsIcon icon={ComputerDollarIcon} />
            }
        ] : []),
        ...(userAccount?.accounts_roles?.some(role => role.role_id === 2 || role.role_id === 3) ? [
            {
                id: 5,
                title: "Return",
                to: "#",
                icon: <HugeiconsIcon icon={ReturnRequestIcon} />
            }
        ] : []),
        ...(userAccount?.accounts_roles?.some(role => role.role_id === 2 || role.role_id === 3) ? [
            {
                id: 6,
                title: "Carriers",
                to: "/carriers",
                icon: <HugeiconsIcon icon={TruckDeliveryIcon} />
            }
        ] : []),
        ...(userAccount?.accounts_roles?.some(role => role.role_id === 2 || role.role_id === 3) ? [
            {
                id: 7,
                title: "Vendors",
                to: "#",
                icon: <HugeiconsIcon icon={Store02Icon} />
            }
        ] : []),
        ...(userAccount?.accounts_roles?.some(role => role.role_id === 2 || role.role_id === 3) ? [
            {
                id: 8,
                title: "Users",
                to: "/users",
                icon: <HugeiconsIcon icon={UserGroupIcon} />
            }
        ] : []),
    ];

    const handleRedirectMenu = (key: number, direction?: string) => {
        var isSudmenu = MenuList.find(m => m.id == key);
        switch (direction) {
            case '#':
                if (isSudmenu != undefined || isSudmenu!.submenu?.length == 0) {
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
                    checkDefaultActive();
                } else {
                    setMenuOpen(key !== menuOpen ? key : null);
                }
                break;
            default:
                if (direction != undefined) {
                    if (key !== menuOpen) {
                        setMenuOpen(key);
                        if (direction != undefined) {
                            setIsLaunching(true);
                            router.push(direction!);
                        }
                    }
                } else if (isSudmenu?.submenu?.length! > 0) {
                    setMenuOpen(key !== menuOpen ? key : null);
                }
                break;
        }
    }

    const checkDefaultActive = () => {
        for (const item of MenuList) {
            if (item.to?.toLowerCase() === pathname) {
                if (item.id !== menuOpen) {
                    setMenuOpen(item.id);
                }
                return;
            }

            if (item.submenu) {
                for (const sub of item.submenu) {
                    if (sub.to?.toLowerCase() === pathname) {
                        if (item.id !== menuOpen) {
                            setMenuOpen(item.id);
                        }
                        return;
                    }
                }
            }
        }
    };

    useEffect(() => {
        checkDefaultActive();
    }, [userAccount?.accounts_roles]);

    useEffect(() => {
        setSideWidth(open ? 250 : 50);
    }, [open])

    return (
        <Box sx={{ width: sideWidth, justifyItems: 'center', transition: 'all .2s ease-in-out' }} className="transparent-blur-container">
            <IconButton LinkComponent={Link} href='/dashboard' onClick={() => setOpen(false)}>
                <Avatar
                    sx={{ transition: 'all .2s ease-in-out', width: open ? 80 : 50, height: open ? 80 : 50, '& > img': { objectPosition: 'bottom' } }}
                    alt='profile'
                    src='/static/img/logos/vibehub-logo-black.png'
                />
            </IconButton>
            <List sx={{ width: '100%' }}>
                {MenuList.map(item => (
                    <Box key={item.id}>
                        {open ? item.submenu ? <ListItem
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
                                        {open && <ListItemText primary={subItem.title} />}
                                    </ListItemButton>
                                ))}
                            </List>
                        </Collapse>
                    </Box>
                ))}
                <Box sx={{ height: 50 }} />
                <ListItemButton onClick={() => {
                    setMenuOpen(null);
                    handleRedirectMenu(24, '/help-center');
                }} selected={menuOpen == 24}>
                    <ListItemIcon>
                    <HugeiconsIcon icon={CustomerService01Icon} />
                    </ListItemIcon>
                    <ListItemText primary={'Help Center'} />
                </ListItemButton>
            </List>
        </Box>
    )
}

export default SideBar
