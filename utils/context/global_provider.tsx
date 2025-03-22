'use client'
import { createContext, ReactNode, useEffect, useState } from "react";
import { AccountContent, CustomerContent, GlobalContent, LocationContent, NotificationContent, OrderContent, ProductContent, RackContent, RoleContent, UserContent } from "../interfaces";
import { createClient } from "../supabase/client";

export const GlobalContext = createContext<GlobalContent>({});

const GlobalProvider = ({ children }: { children: ReactNode }) => {
    const supabase = createClient();

    const [roles, setRoles] = useState<RoleContent[]>([]);
    const [users, setUsers] = useState<UserContent[]>([]);
    const [racks, setRacks] = useState<RackContent[]>([]);
    const [orders, setOrders] = useState<OrderContent[]>([]);
    const [products, setProducts] = useState<ProductContent[]>([]);
    const [userAccount, setUserAccount] = useState<AccountContent>();
    const [locations, setLocations] = useState<LocationContent[]>([]);
    const [customers, setCustomers] = useState<CustomerContent[]>([]);
    const [notifications, setNotifications] = useState<NotificationContent[]>([]);

    useEffect(() => {
        // RealTime DEtecting 
        const channel = supabase.channel('realtime products').on('postgres_changes', {
            event: 'INSERT', schema: 'public', table: 'products'
        }, (payload) => {
            getProducts();
        }).on('postgres_changes', {
            event: 'INSERT', schema: 'public', table: 'racks'
        }, (payload) => {
            getRacks();
        }).subscribe();

        const getProducts = async () => {
            var returnProducts = [];

            const { data: productsQuery, error: productsError } = await supabase.from('products').select('*');

            if (productsQuery!.length > 0) {
                for (var product of productsQuery!) {
                    var locationsQuery = await supabase.from('racks_locations').select().eq('product_id', product.id).maybeSingle();
                    if (locationsQuery != null) {
                        returnProducts.push({...product, 'locations': locationsQuery});
                    } else {
                        returnProducts.push(product);
                    }
                }
            }

            setProducts(returnProducts);
        }

        getProducts();

        const getRacks = async () => {
            const { data } = await supabase.from('racks').select();
            setRacks(data ?? []);
        }

        getRacks();

        const getAccountInformation = async () => {
            const { data: userData} = await supabase.auth.getUser();

            const { data: account, error: accountError } = await supabase
                .from('accounts')
                .select('*, roles (id, name)')
                .eq('user_id',userData.user!.id)
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

        return () => {
            supabase.removeChannel(channel);
        }
    }, [supabase])


    return (
        <GlobalContext.Provider value={{ locations, roles, users, customers, products, racks, notifications, orders, userAccount }}>{children}</GlobalContext.Provider>
    )
};

export default GlobalProvider