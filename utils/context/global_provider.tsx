'use client'
import { createContext, ReactNode, useEffect, useState } from "react";
import { CustomerContent, GlobalContent, LocationContent, NotificationContent, OrderContent, ProductContent, RackContent, RoleContent, UserContent } from "../interfaces";
import { createClient } from "../supabase/client";

export const GlobalContext = createContext<GlobalContent>({});

const GlobalProvider = ({ children }: { children: ReactNode }) => {
    const supabase = createClient();

    const [locations, setLocations] = useState<LocationContent[]>([]);
    const [roles, setRoles] = useState<RoleContent[]>([]);
    const [users, setUsers] = useState<UserContent[]>([]);
    const [customers, setCustomers] = useState<CustomerContent[]>([]);
    const [products, setProducts] = useState<ProductContent[]>([]);
    const [racks, setRacks] = useState<RackContent[]>([]);
    const [notifications, setNotifications] = useState<NotificationContent[]>([]);
    const [orders, setOrders] = useState<OrderContent[]>([]);

    useEffect(() => {
        // RealTime DEtecting 
        const channel = supabase.channel('realtime products').on('postgres_changes', {
            event: 'INSERT', schema: 'public', table: 'products'
        }, (payload) => {
            getProducts();
        }) .on('postgres_changes', {
            event: 'INSERT', schema: 'public', table: 'racks'
          }, (payload) => {
            getRacks();
          }).subscribe();

        const getProducts = async () => {
            const { data } = await supabase.from('products').select();
            setProducts(data ?? []);
        }

        getProducts();

        const getRacks = async () => {
            const { data } = await supabase.from('racks').select();
            setRacks(data ?? []);
        }

        getRacks();

        return () => {
            supabase.removeChannel(channel);
        }
    }, [supabase])


    return (
        <GlobalContext.Provider value={{ locations, roles, users, customers, products, racks, notifications, orders }}>{children}</GlobalContext.Provider>
    )
};

export default GlobalProvider