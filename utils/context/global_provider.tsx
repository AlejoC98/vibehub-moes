'use client'
import { createContext, ReactNode, useEffect, useState } from "react";
import { AccountContent, CarriersContent, CustomerContent, GlobalContent, LocationContent, NotificationContent, OrderContent, ProductContent, RackContent, ReceivingContent, RoleContent, RoleNotificationContent, ShippingContent, VendorsContent } from "../interfaces";
import { createClient } from "../supabase/client";

export const GlobalContext = createContext<GlobalContent>({
    isLaunching: true,
    setIsLaunching: function (status: boolean): void {
        throw new Error("Function not implemented.");
    }
});

const GlobalProvider = ({ children }: { children: ReactNode }) => {
    const supabase = createClient();

    const [isLaunching, setIsLaunching] = useState<boolean>(true);
    const [roles, setRoles] = useState<RoleContent[]>([]);
    const [users, setUsers] = useState<AccountContent[]>([]);
    const [racks, setRacks] = useState<RackContent[]>([]);
    const [orders, setOrders] = useState<OrderContent[]>([]);
    const [receivings, setReceivings] = useState<ReceivingContent[]>([]);
    const [shippings, setShippings] = useState<ShippingContent[]>([]);
    const [products, setProducts] = useState<ProductContent[]>([]);
    const [userAccount, setUserAccount] = useState<AccountContent>();
    const [locations, setLocations] = useState<LocationContent[]>([]);
    const [vendors, setVendors] = useState<VendorsContent[]>([]);
    const [carriers, setCarriers] = useState<CarriersContent[]>([]);
    const [notifications, setNotifications] = useState<RoleNotificationContent[]>([]);

    useEffect(() => {
        // Realtime changes 
        const channel = supabase.channel('realtime changes').on('postgres_changes', {
            event: '*', schema: 'public', table: 'shippings_orders'
        }, (payload) => {
            setTimeout(() => {
                getShippingsOrders();
            }, 2000);
        }).on('postgres_changes', {
            event: '*', schema: 'public', table: 'shippings_pick_list'
        }, (payload) => {
            setTimeout(() => {
                getShippingsOrders();
            }, 2000);
        }).on('postgres_changes', {
            event: '*', schema: 'public', table: 'notifications'
        }, (payload) => {
            setTimeout(async () => {
                var currentUserSession = await supabase.auth.getUser();

                var { data: userData, error } = await supabase.from('accounts').select().eq('user_id', currentUserSession?.data!.user!.id).single();

                getNotifications(userData.role_id);
            }, 2000);
        }).on('postgres_changes', {
            event: '*', schema: 'public', table: 'accounts'
        }, (payload) => {
            setTimeout(() => {
                getUser();
            }, 2000);
        }).on('postgres_changes', {
            event: '*', schema: 'public', table: 'accounts_roles'
        }, (payload) => {
            setTimeout(() => {
                getUser();
            }, 2000);
        }).on('postgres_changes', {
            event: '*', schema: 'public', table: 'carriers'
        }, (payload) => {
            setTimeout(() => {
                getCarriers();
            }, 2000);
        }).subscribe();
        // .on('postgres_changes', {
        //         event: '*', schema: 'public', table: 'racks'
        //     }, (payload) => {
        //         setTimeout(() => {
        //             getRacks();
        //         }, 2000);
        //     }).on('postgres_changes', {
        //         event: '*', schema: 'public', table: 'racks_locations'
        //     }, (payload) => {
        //         setTimeout(() => {
        //             getRacks();
        //         }, 2000);
        //     }).on('postgres_changes', {
        //         event: '*', schema: 'public', table: 'racks_locations_products'
        //     }, (payload) => {
        //         setTimeout(() => {
        //             getRacks();
        //         }, 2000);
            // }).on('postgres_changes', {
            //     event: '*', schema: 'public', table: 'accounts'
            // }, (payload) => {
            //     setTimeout(() => {
            //         getUser();
            //     }, 2000);
            // }).on('postgres_changes', {
        //         event: '*', schema: 'public', table: 'vendors'
        //     }, (payload) => {
        //         setTimeout(() => {
        //             getVendors();
        //         }, 2000);
        //     })
        //     .on('postgres_changes', {
        //         event: '*', schema: 'public', table: 'receivings'
        //     }, (payload) => {
        //         setTimeout(() => {
        //             getReceivings();
        //         }, 2000);
        //     })

        const getProducts = async () => {
            var returnProducts = [];

            const { data: productsQuery, error: productsError } = await supabase.from('products').select('*');

            if (productsQuery!.length > 0) {
                for (var product of productsQuery!) {
                    var locationsQuery = await supabase.from('racks_locations').select().eq('product_id', product.id).maybeSingle();
                    if (locationsQuery != null) {
                        returnProducts.push({ ...product, 'locations': locationsQuery });
                    } else {
                        returnProducts.push(product);
                    }
                }
            }

            setProducts(returnProducts);
        }

        getProducts();

        const getRacks = async () => {
            const { data: racksQuery, error: racksError } = await supabase
                .from('racks')
                .select('*,racks_locations (*, racks_locations_products(*, products(*)))');
            setRacks(racksQuery ?? []);
        }

        getRacks();

        const getNotifications = async (role?: number) => {
            const roleIds = userAccount?.accounts_roles?.map(item => item.role_id) || [];

            const { data: notiQuery, error } = await supabase.from('roles_notifications').select('*, notifications(*)').in('role_id', roleIds);

            setNotifications(notiQuery || []);
        }

        const getAccountInformation = async () => {
            const { data: userData } = await supabase.auth.getUser();

            const { data: account, error: accountError } = await supabase
                .from('accounts')
                .select('*, accounts_roles(*, roles(id, name))')
                .eq('user_id', userData.user!.id)
                .single();

            setUserAccount({
                'id': account.id,
                'user_id': account.user_id,
                'first_name': account.first_name,
                'last_name': account.last_name,
                'email': userData.user!.email,
                'username': 'string',
                'accounts_roles': account.accounts_roles,
            });

            getNotifications(account['role_id']);
        }

        getAccountInformation();

        const getRoles = async () => {
            const { data: rolesQuery, error: roleErrors } = await supabase.from('roles').select().not('id', 'eq', 1);

            setRoles(rolesQuery || []);
        }

        getRoles();

        const getUser = async () => {
            const { data: usersQuery, error: userError } = await supabase
                .from('accounts')
                .select('*, accounts_roles(*, roles(id, name))');

            const filteredUsers = usersQuery?.filter(account =>
                !account.accounts_roles?.some((ar: any) => ar.roles?.id === 1)
            );

            setUsers(filteredUsers || []);
        }

        getUser();

        const getVendors = async () => {
            const { data: vendorsQuery, error } = await supabase.from('vendors').select();

            setVendors(vendorsQuery || []);
        }

        getVendors();

        const getCarriers = async () => {
            const { data: carriersQuery, error } = await supabase.from('carriers').select();

            setCarriers(carriersQuery || []);
        }

        getCarriers();

        const getReceivings = async () => {
            const { data: receivingQuery, error: receivingError } = await supabase.from('receiving').select('*, vendors(id, name), receiving_products(*, products(*))');
            setReceivings(receivingQuery || []);
        }

        getReceivings();

        const getShippingsOrders = async () => {
            const { data: shippingQuery, error } = await supabase.from('shippings_orders').select('*, shippings_pick_list(*, shippings_products(*))');

            setShippings(shippingQuery || []);
        }

        getShippingsOrders();

        return () => {
            supabase.removeChannel(channel);
        }
    }, [supabase])


    return (
        <GlobalContext.Provider value={{ locations, roles, users, vendors, carriers, products, racks, notifications, orders, userAccount, receivings, shippings, isLaunching, setIsLaunching }}>{children}</GlobalContext.Provider>
    )
};

export default GlobalProvider