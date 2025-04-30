'use client'
import { Box, Collapse, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import React, { Fragment, useContext, useEffect, useState } from 'react'
import { GlobalContext } from '@/utils/context/global_provider';
import { usePathname, useRouter } from 'next/navigation';
import { MenuItem } from '@/utils/interfaces';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Swal from 'sweetalert2';
import { HugeiconsIcon } from '@hugeicons/react';
import { DashboardSquare02Icon, FlowIcon, Trolley02Icon, LiftTruckIcon, PackageMovingIcon, TaskDaily01Icon, ComputerDollarIcon, ReturnRequestIcon, TruckDeliveryIcon, Store02Icon, UserGroupIcon, CustomerService01Icon, ProductLoadingIcon, DistributeVerticalBottomIcon, DigitalClockIcon } from '@hugeicons/core-free-icons';

const DrawerMenu = ({ openDrawer, toggleDrawer }: { openDrawer: boolean, toggleDrawer: (status: boolean) => void }) => {

    const { userAccount, setIsLaunching } = useContext(GlobalContext);

    const router = useRouter();
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState<number | null>(1);

    const MenuList: MenuItem[] = [
        {
            id: 1,
            title: "Dashboard",
            to: "/dashboard",
            icon: <HugeiconsIcon icon={DashboardSquare02Icon} />
        },
        ...(userAccount?.accounts_roles?.some(role => [1, 2, 3, 4].includes(role.role_id)) ? [
            {
                id: 2,
                title: "Inventory",
                to: "/inventory",
                icon: <HugeiconsIcon icon={ProductLoadingIcon} />
            },
            {
                id: 3,
                title: "Rack Map",
                to: "/racks",
                icon: <HugeiconsIcon icon={DistributeVerticalBottomIcon} />
            }
        ] : []),
        {
            id: 4,
            title: "Logistics",
            icon: <HugeiconsIcon icon={FlowIcon} />,
            submenu: [
                ...(userAccount?.accounts_roles?.some(role => role.role_id === 7) ? [
                    {
                        id: 5,
                        title: "Shipping",
                        to: "/shipping",
                        icon: <HugeiconsIcon icon={Trolley02Icon} />
                    }
                ] : []),
                ...(userAccount?.accounts_roles?.some(role => role.role_id === 8) ? [
                    {
                        id: 6,
                        title: "Receiving",
                        to: "/receiving",
                        icon: <HugeiconsIcon icon={LiftTruckIcon} />
                    }
                ] : []),
                ...(userAccount?.accounts_roles?.some(role => role.role_id === 9) ? [
                    {
                        id: 7,
                        title: "Replenishment",
                        to: "/replenishment",
                        icon: <HugeiconsIcon icon={PackageMovingIcon} />
                    }
                ] : []),
                ...(userAccount?.accounts_roles?.some(role => role.role_id === 5) ? [
                    {
                        id: 8,
                        title: "Picking",
                        to: "/picking",
                        icon: <HugeiconsIcon icon={TaskDaily01Icon} />
                    }
                ] : []),
            ]
        },
        ...(userAccount?.accounts_roles?.some(role => [2, 3].includes(role.role_id)) ? [
            {
                id: 9,
                title: "Orders",
                to: "/orders",
                icon: <HugeiconsIcon icon={ComputerDollarIcon} />
            },
            {
                id: 10,
                title: "Returns",
                to: "/returns",
                icon: <HugeiconsIcon icon={ReturnRequestIcon} />
            },
            {
                id: 11,
                title: "Carriers",
                to: "/carriers",
                icon: <HugeiconsIcon icon={TruckDeliveryIcon} />
            },
            {
                id: 12,
                title: "Vendors",
                to: "/vendors",
                icon: <HugeiconsIcon icon={Store02Icon} />
            },
            {
                id: 13,
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
                    toggleDrawer(false);
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
                            toggleDrawer(false);
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
                            <ListItemButton sx={{ padding: '10px 0', justifyContent: 'center', alignItems: 'center' }}
                            selected={menuOpen === item.id}
                            onClick={() => handleRedirectMenu(item.id)}>
                                <ListItemIcon sx={{ justifyContent: 'center' }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.title} />
                            </ListItemButton>
                        </ListItem> : <ListItemButton
                            sx={{ padding: '10px 0', justifyContent: 'center', alignItems: 'center' }}
                            selected={menuOpen === item.id}
                            onClick={() => {
                                handleRedirectMenu(item.id, item.to);
                            }}>
                            <ListItemIcon sx={{ justifyContent: 'center' }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.title} />
                        </ListItemButton> : <ListItemButton
                            sx={{ padding: '10px 0', justifyContent: 'center', alignItems: 'center' }}
                            selected={menuOpen === item.id}
                            onClick={() => {
                                handleRedirectMenu(item.id, item.to);
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
                <Box sx={{ height: 20 }} />
                <ListItemButton onClick={() => {
                    setMenuOpen(null);
                    toggleDrawer(false);
                    handleRedirectMenu(24, '/help-center');
                }} selected={menuOpen == 24}>
                    <ListItemIcon>
                    <HugeiconsIcon icon={CustomerService01Icon} />
                    </ListItemIcon>
                    <ListItemText primary={'Help Center'} />
                </ListItemButton>
            </Drawer>
        </Fragment>
    )
}

export default DrawerMenu
