'use client'
import { createContext, ReactNode, useEffect, useState } from "react";
import { AccountContent, CustomerContent, GlobalContent, LocationContent, NotificationContent, OrderContent, ProductContent, RackContent, ReceivingContent, RoleContent, ShippingContent, UserContent, VendorContent } from "../interfaces";
import { createClient } from "../supabase/client";

export const GlobalContext = createContext<GlobalContent>({});

const GlobalProvider = ({ children }: { children: ReactNode }) => {
    const supabase = createClient();

    const [roles, setRoles] = useState<RoleContent[]>([]);
    const [users, setUsers] = useState<UserContent[]>([]);
    const [racks, setRacks] = useState<RackContent[]>([]);
    const [orders, setOrders] = useState<OrderContent[]>([]);
    const [receivings, setReceivings] = useState<ReceivingContent[]>([]);
    const [shippings, setShippings] = useState<ShippingContent[]>([]);
    const [products, setProducts] = useState<ProductContent[]>([]);
    const [userAccount, setUserAccount] = useState<AccountContent>();
    const [locations, setLocations] = useState<LocationContent[]>([]);
    const [vendors, setVendors] = useState<VendorContent[]>([]);
    const [notifications, setNotifications] = useState<NotificationContent[]>([]);

    useEffect(() => {
        // Realtime changes 
        const channel = supabase.channel('realtime changes').on('postgres_changes', {
            event: '*', schema: 'public', table: 'products'
        }, (payload) => {
            setTimeout(() => {
                getProducts();
            }, 2000);
        }).on('postgres_changes', {
                event: '*', schema: 'public', table: 'racks'
            }, (payload) => {
                setTimeout(() => {
                    getRacks();
                }, 2000);
            }).on('postgres_changes', {
                event: '*', schema: 'public', table: 'racks_locations'
            }, (payload) => {
                setTimeout(() => {
                    getRacks();
                }, 2000);
            }).on('postgres_changes', {
                event: '*', schema: 'public', table: 'racks_locations_products'
            }, (payload) => {
                setTimeout(() => {
                    getRacks();
                }, 2000);
            }).on('postgres_changes', {
                event: '*', schema: 'public', table: 'accounts'
            }, (payload) => {
                setTimeout(() => {
                    getUser();
                }, 2000);
            }).on('postgres_changes', {
                event: '*', schema: 'public', table: 'vendors'
            }, (payload) => {
                setTimeout(() => {
                    getVendors();
                }, 2000);
            })
            .on('postgres_changes', {
                event: '*', schema: 'public', table: 'receivings'
            }, (payload) => {
                setTimeout(() => {
                    getReceivings();
                }, 2000);
            }).on('postgres_changes', {
                event: '*', schema: 'public', table: 'shippings'
            }, (payload) => {
                setTimeout(() => {
                    getShippings();
                }, 2000);
            }).subscribe();

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

        const getAccountInformation = async () => {
            const { data: userData } = await supabase.auth.getUser();

            const { data: account, error: accountError } = await supabase
                .from('accounts')
                .select('*, roles (id, name)')
                .eq('user_id', userData.user!.id)
                .single();

            setUserAccount({
                'first_name': 'string',
                'last_name': 'string',
                'email': userData.user!.email,
                'username': 'string',
                'role': {
                    'id': account['role_id'],
                    'name': account['roles']['name'],
                },
            });
        }

        getAccountInformation();

        const getRoles = async () => {
            const { data: rolesQuery, error: roleErrors } = await supabase.from('roles').select().not('id', 'eq', 1);

            setRoles(rolesQuery || []);
        }

        getRoles();

        const getUser = async () => {
            const { data: usersQuery, error: userError } = await supabase.from('accounts').select('*, roles(id, name)').not('role_id', 'eq', 1);

            setUsers(usersQuery || []);
        }

        getUser();

        const getVendors = async () => {
            const { data: vendorsQuery, error } = await supabase.from('vendors').select();

            setVendors(vendorsQuery || []);
        }

        getVendors();

        const getReceivings = async () => {
            const { data: receivingQuery, error: receivingError } = await supabase.from('receiving').select('*, vendors(id, name), receiving_products(*, products(*))');
            setReceivings(receivingQuery || []);
        }

        getReceivings();

        const getShippings = async () => {
            const { data: shippingQuery, error } = await supabase.from('shippings').select('*, shippings_products(*)');

            setShippings(shippingQuery || []);
        }

        getShippings();

        // const getLocations = async () => {
        //     const { data: locationsQuery, error: locationsError } = await supabase
        //         .from('racks')
        //         .select('*,racks_locations (*, racks_locations_products(*))');


        //     setLocations(locationsQuery || []);
        // }

        // getLocations();

        return () => {
            supabase.removeChannel(channel);
        }
    }, [supabase])


    return (
        <GlobalContext.Provider value={{ locations, roles, users, vendors, products, racks, notifications, orders, userAccount, receivings, shippings }}>{children}</GlobalContext.Provider>
    )
};

export default GlobalProvider