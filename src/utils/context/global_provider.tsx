'use client'
import { createContext, ReactNode, useEffect, useState } from "react";
import { AccountContent, AccountRolesContent, CarriersContent, CustomerContent, GlobalContent, LocationContent, NotificationContent, OrderContent, PickingTasksContent, ProductContent, RackContent, ReceivingContent, RoleContent, RoleNotificationContent, ShippingContent, UpdateReportContent, VendorsContent } from "@/utils/interfaces";
import { createClient } from "@/utils/supabase/client";
import { createNotification } from "../functions/main";

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
    const [updateReports, setUpdatesReports] = useState<UpdateReportContent[]>();
    const [receivings, setReceivings] = useState<ReceivingContent[]>([]);
    const [shippings, setShippings] = useState<ShippingContent[]>([]);
    const [products, setProducts] = useState<ProductContent[]>([]);
    const [userAccount, setUserAccount] = useState<AccountContent>();
    const [locations, setLocations] = useState<LocationContent[]>([]);
    const [vendors, setVendors] = useState<VendorsContent[]>([]);
    const [carriers, setCarriers] = useState<CarriersContent[]>([]);
    const [pickingTasks, setPickingTasks] = useState<PickingTasksContent[]>([]);
    const [notifications, setNotifications] = useState<RoleNotificationContent[]>([]);

    useEffect(() => {
        // Realtime changes 
        const channel = supabase.channel('realtime changes')
            .on('postgres_changes', {
                event: '*', schema: 'public', table: 'shippings_orders'
            }, (payload) => {
                if (payload.eventType === 'INSERT') {
                    createNotification([1, 2, 3], `/shipping/${payload.new['trailer_number']}`);
                }
                setTimeout(() => {
                    getShippingsOrders();
                }, 500);
            })
            .on('postgres_changes', {
                event: '*', schema: 'public', table: 'shippings_pick_list'
            }, (payload) => {
                setTimeout(() => {
                    getShippingsOrders();
                }, 500);
            })
            .on('postgres_changes', {
                event: '*', schema: 'public', table: 'shippings_products'
            }, (payload) => {
                setTimeout(() => {
                    getShippingsOrders();
                }, 500);
            })
            .on('postgres_changes', {
                event: '*', schema: 'public', table: 'products'
            }, (payload) => {
                setTimeout(() => {
                    getProducts();
                }, 500);
            })
            .on('postgres_changes', {
                event: '*', schema: 'public', table: 'pickings'
            }, (payload) => {
                setTimeout(() => {
                    getPickingTask();
                }, 1000);
            })
            .on('postgres_changes', {
              event: '*', schema: 'public', table: 'pickings_products'
            }, (payload) => {
                setTimeout(() => {
                    getPickingTask();
                }, 1000);
            })
            .subscribe();
            // .on('postgres_changes', {
            //     event: '*', schema: 'public', table: 'shippings_pick_list'
            // }, (payload) => {
            //     setTimeout(() => {
            //         getShippingsOrders();
            //     }, 1000);
            // })
            // .on('postgres_changes', {
            //     event: '*', schema: 'public', table: 'notifications'
            // }, (payload) => {
            //     setTimeout(async () => {
            //         var currentUserSession = await supabase.auth.getUser();

            //         var { data: userData } = await supabase.from('accounts').select().eq('user_id', currentUserSession?.data!.user!.id).single();

            //         getNotifications(userData.accounts_roles);
            //     }, 1000);
            // })
            // .on('postgres_changes', {
            //     event: '*', schema: 'public', table: 'accounts'
            // }, (payload) => {
            //     setTimeout(() => {
            //         getUser();
            //     }, 1000);
            // })
            // .on('postgres_changes', {
            //     event: '*', schema: 'public', table: 'accounts_roles'
            // }, (payload) => {
            //     setTimeout(() => {
            //         getUser();
            //     }, 1000);
            // })
            // .on('postgres_changes', {
            //     event: 'INSERT', schema: 'public', table: 'carriers'
            // }, (payload) => {
            //     setTimeout(() => {
            //         getCarriers();
            //     }, 1000);
            // })
        // .on('postgres_changes', {
        //         event: '*', schema: 'public', table: 'racks'
        //     }, (payload) => {
        //         setTimeout(() => {
        //             getRacks();
        //         }, 1000);
        //     }).on('postgres_changes', {
        //         event: '*', schema: 'public', table: 'racks_locations'
        //     }, (payload) => {
        //         setTimeout(() => {
        //             getRacks();
        //         }, 1000);
        //     }).on('postgres_changes', {
        //         event: '*', schema: 'public', table: 'racks_locations_products'
        //     }, (payload) => {
        //         setTimeout(() => {
        //             getRacks();
        //         }, 1000);
        // }).on('postgres_changes', {
        //     event: '*', schema: 'public', table: 'accounts'
        // }, (payload) => {
        //     setTimeout(() => {
        //         getUser();
        //     }, 1000);
        // }).on('postgres_changes', {
        //         event: '*', schema: 'public', table: 'vendors'
        //     }, (payload) => {
        //         setTimeout(() => {
        //             getVendors();
        //         }, 1000);
        //     })
        //     .on('postgres_changes', {
        //         event: '*', schema: 'public', table: 'receivings'
        //     }, (payload) => {
        //         setTimeout(() => {
        //             getReceivings();
        //         }, 1000);
        //     })

        const getProducts = async () => {
            var returnProducts = [];
            const { data: productsQuery, error: productsError } = await supabase
              .from('products')
              .select('*')
              .not('deleted', 'eq', true)
              .order('created_at', { ascending: false });
          
            if (productsQuery!.length > 0) {
              for (var product of productsQuery!) {
                var { data: locationsQuery, error } = await supabase
                  .from('racks_locations')
                  .select()
                  .eq('product_id', product.id)
                  .maybeSingle();
          
                if (!error && locationsQuery != null) {
                  returnProducts.push({ ...product, locations: locationsQuery, quantity: 0});
                } else {
                  returnProducts.push({...product, quantity: 0});
                }
              }
            }
          
            setProducts(returnProducts);
          };
          getProducts();
          
          const getRacks = async () => {
            const { data: racksQuery, error: racksError } = await supabase
              .from('racks')
              .select('*, racks_locations (*, racks_locations_products(*, products(*)))')
              .order('created_at', { ascending: false });
          
            setRacks(racksQuery ?? []);
          };
          getRacks();
          
          const getNotifications = async (account_roles?: AccountRolesContent[]) => {
            var roleIds: number[] = [];
          
            if (roles?.length == 0) {
              roleIds = userAccount?.accounts_roles?.map(item => item.role_id) || [];
            } else {
              roleIds = account_roles?.map((item: any) => item.role_id) || [];
            }
          
            const { data: notiQuery, error } = await supabase
              .from('roles_notifications')
              .select('*, notifications(*)')
              .in('role_id', roleIds)
              .order('created_at', { ascending: false });
          
            setNotifications(notiQuery || []);
          };
          
          const getAccountInformation = async () => {
            const { data: userData } = await supabase.auth.getUser();
          
            const { data: account, error: accountError } = await supabase
              .from('accounts')
              .select('*, locations!accounts_location_id_fkey(*), accounts_roles(*, roles(id, name))')
              .eq('user_id', userData.user!.id)
              .single();
          
            const userTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
          
            setUserAccount({ ...account, 'sessionTimeZone': userTZ });
          
            getNotifications(account.accounts_roles);
          };
          getAccountInformation();
          
          const getRoles = async () => {
            const { data: rolesQuery, error: roleErrors } = await supabase
              .from('roles')
              .select()
              .not('id', 'eq', 1)
              .order('created_at', { ascending: false });
          
            setRoles(rolesQuery || []);
          };
          getRoles();
          
          const getUser = async () => {
            const { data: usersQuery, error: userError } = await supabase
              .from('accounts')
              .select('*, accounts_roles(*, roles(id, name)), locations(*)')
              .order('created_at', { ascending: false });
          
            const filteredUsers = usersQuery?.filter(account =>
              !account.accounts_roles?.some((ar: any) => ar.roles?.id === 1)
            );
          
            setUsers(filteredUsers || []);
          };
          getUser();
          
          const getVendors = async () => {
            const { data: vendorsQuery, error } = await supabase
              .from('vendors')
              .select()
              .order('created_at', { ascending: false });
          
            setVendors(vendorsQuery || []);
          };
          getVendors();
          
          const getCarriers = async () => {
            const { data: carriersQuery, error } = await supabase
              .from('carriers')
              .select()
              .order('created_at', { ascending: false });
          
            setCarriers(carriersQuery || []);
          };
          getCarriers();
          
          const getReceivings = async () => {
            const { data: receivingQuery, error: receivingError } = await supabase
              .from('receiving')
              .select('*, vendors(id, name), receiving_products(*, products(*))')
              .order('created_at', { ascending: false });
          
            setReceivings(receivingQuery || []);
          };
          getReceivings();
          
          const getShippingsOrders = async () => {
            const { data: shippingQuery, error } = await supabase
              .from('shippings_orders')
              .select('*, shippings_pick_list(*, shippings_products(*, shippings_products_serials(*)))')
              .not('deleted', 'eq', true)
              .order('created_at', { ascending: false });
          
            setShippings(shippingQuery || []);
          };
          getShippingsOrders();
          
          const getUpdatesReports = async () => {
            const { data: reports, error } = await supabase
              .from('reports_updates')
              .select()
              .order('created_at', { ascending: false });
          
            setUpdatesReports(reports || []);
          };

          getUpdatesReports();

          const getPickingTask = async() => {
            const { data: pickings, error } = await supabase
              .from('pickings')
              .select('*, pickings_products(*)')
              .order('created_at', { ascending: false });

              setPickingTasks(pickings || []);
          }

          getPickingTask();

        return () => {
            supabase.removeChannel(channel);
        }
    }, [supabase]);

    return (
        <GlobalContext.Provider value={{ locations, roles, users, vendors, carriers, products, racks, notifications, orders, userAccount, receivings, shippings, updateReports, pickingTasks, isLaunching, setIsLaunching }}>{children}</GlobalContext.Provider>
    )
};

export default GlobalProvider