import { ReactNode } from "react";

export interface Role {
    id: number,
    name: string;
}

export interface AccountRolesContent {
    id: number;
    roles: Role;
    role_id: number;
    account_id: number;
    created_at: string;
}

export interface MenuItem {
    id: number,
    title: string;
    to?: string;
    icon: ReactNode;
    submenu?: MenuItem[] | [];
}

export interface AccountContent {
    id?: number;
    user_id: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    username?: string;
    password?: string;
    phone: number;
    locations: LocationContent;
    accounts_roles?: AccountRolesContent[];
    sessionTimeZone: string;
}

export interface TabContentProps {
    index: number;
    value: number;
    children: ReactNode
}

export interface TabListProps {
    index: number;
    label: string;
    content: TabContentProps
}

export interface RoleOpt {
    label: string;
    value: number;
}

export interface LocationOpt {
    label: string;
    value: number;
}

export interface GlobalContent {
    locations?: LocationContent[];
    roles?: RoleContent[];
    users?: AccountContent[];
    vendors?: VendorsContent[];
    carriers?: CarriersContent[];
    products?: ProductContent[];
    racks?: RackContent[];
    positions?: PositionContent[];
    notifications?: RoleNotificationContent[];
    orders?: OrderContent[];
    userAccount?: AccountContent;
    receivings?: ReceivingContent[];
    shippings?: ShippingContent[];
    updateReports?: UpdateReportContent[];
    pickingTasks?: PickingTasksContent[];
    isLaunching: boolean;
    setIsLaunching: (status: boolean) => void
}

export interface LocationContent {
    id: number;
    name: string;
    city: string,
    state: string;
    street: string;
    zip: number;
    deleted: boolean;
    createdBy: number;
    updatedBy?: number;
    createdAt: Date;
    updatedAt?: Date;
}

export interface RoleContent {
    id: number;
    name: string;
    deleted: boolean;
    createdBy: number;
    updatedBy?: number;
    createdAt: Date;
    updatedAt?: Date;
}

export interface ProductInput {
    id: number;
    sku: string;
    name: string;
    item: string;
}
export interface ProductContent {
    id?: number;
    quantity?: number;
    img_url?: string;
    sku?: string;
    name?: string;
    item?: string;
    created_at: string;
    created_by: string | number;
}

export interface RackInput {
    racks: string;
    columns: string;
    rows: string;
}

export interface RackContent {
    id?: number;
    name: string;
    columns: string;
    rows: string;
    racks_locations: RackLocationContent[];
}

export interface RackLocationContent {
    id?: number;
    sku: string;
    name: string;
    rack_id: number;
    racks_locations_products: RackLocationProductContent[];
}

export interface RackLocationProductContent {
    id?: number;
    quantity: number;
    product_id: number;
    rack_location_id: number;
    products?: ProductContent;
}

export interface ReceivingContent {
    id: number;
    po_number: string;
    vendor_id: number;
    arrived_at: Date;
    trailer_number: string;
    assign_to: number,
    receiving_products?: ReceivingProductsContent[];
    vendors?: VendorsContent[];
    status: string;
}

export interface PickingInput {
    id?: number;
    product_sku: string;
    img_url?: string;
    img_file?: File;
    serial_number: number;
    product_quantity: number;
    picked_by: string;
    verify_by?: string;
}

export interface PickingTasksContent {
    id: number;
    pick_number: number;
    created_by: string;
    status: string;
    verified_by?: string;
    img_url: string;
    pickings_products: PickingTasksProductsContent[];
}

export interface PickingTasksProductsContent {
    id: number;
    product_sku: string;
    product_quantity: number;
    is_ready: boolean;
    created_by: string;
    img_url?: string;
    picked_by: string;
    serial_number?: number;
    picking_id: number;
}


export interface ReceivingProductsInput extends ProductContent {
    id?: number;
    product_id?: number;
    sku: string;
    name?: string;
    expected_quantity: number;
    received_quantity: number;
    damaged_quantity: number;
}

export interface ReceivingProductsContent {
    receiving_id: number;
    product_id: number;
    expected_quantity: number;
    received_quantity: number;
    damage_quantity: number;
    products: ProductContent;
}

export interface ShippingOrderProductInput {
    id?: number;
    is_ready: boolean;
    product_quantity: number;
    product_sku: string;
    serial_number?: string;
    shipping_order_id: number;
    img_url?: string;
}

export interface ShippingOrderProductContent {
    id?: number;
    is_ready: boolean;
    product_quantity: number;
    created_at: string;
    created_by: string;
    product_sku: string;
    serial_number: string;
    shipping_order_id: number;
}

export interface ShippingContent {
    id: number;
    carrier: string;
    dock_door: number;
    trailer_number: string;
    created_at: string;
    status: string;
    shipped_at: string;
    created_by: string;
    closed_at?: string;
    closed_by?: string;
    assign_to?: string;
    total_shipped: number;
    img_url?: string;
    shippings_pick_list: PickListContent[];
}

export interface PickListContent {
    id?: number;
    pl_number: number;
    closed_at?: string;
    picked_by: string;
    verified_by: string;
    bol_number: string;
    total_products: number,
    notes: string;
    status: string;
    created_at: string;
    created_by: string;
    shippings_products: ShippingOrderProductContent[] | any[];
}

export interface ShippingInput {
    id?: number;
    carrier: string;
    assign_to: string;
    dock_door: number;
    trailer_number: string;
}

export interface PickListInput {
    pl_number: number;
    picked_by: string;
    verified_by: string;
    bol_number: string;
    status: string;
    notes: string;
}

export interface PositionContent {
    id?: number;
    sku?: string;
    name?: string;
    rowPosition?: string;
    columnPosition?: string;
    rackId?: number;
    productId?: number;
    deleted?: boolean;
    createdBy?: number;
    updatedBy?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface OrganizeInput {
    product: string | number;
    position: string | number;
    from: string | number;
    quantity: number | string;
}

export interface PositionProductContent {
    productId: number;
    positionId: number;
    quantity: number;
    condition: string;
    deleted?: boolean;
    createdBy?: number;
    updatedBy?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface RoleNotificationContent {
    created_at: string;
    id: number,
    notification_id: number;
    notifications: NotificationContent;
    role_id: number;
}

export interface NotificationContent {
    id: number;
    title: string;
    text: string;
    type: string;
    status: string;
    redirect_to: string;
    created_by: string;
    usernotificationstatus: RoleNotificationsContent[];
}


export interface RoleNotificationsContent {
    id: number;
    role_id: number;
    created_at?: Date;
    notification_id: number;
}

export interface CustomerInput {
    id: number;
    firstname: string;
    lastname: string;
    address: string;
    address_details: string;
    city: string;
    zipcode: string;
    state: string;
    email: string;
    phone: string;
}

export interface CustomerContent {
    id: number;
    firstname: string;
    lastname: string;
    addresses: AddressContent[];
    orders: OrderContent[];
    email: string;
    phone: string;
    deleted?: boolean;
    createdBy?: number;
    updatedBy?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface VendorsContent {
    id: number;
    name: string;
}

export interface CarriersContent {
    id: number;
    name: string;
}

export interface CarriersInput {
    name: string;
}

export interface AddressContent {
    id: number;
    address: string;
    address_details: string;
    city: string;
    zipcode: string;
    state: string;
    deleted?: boolean;
    createdBy?: number;
    updatedBy?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface OrderContent {
    id: number;
    order_number: string;
    total: number;
    products: OrderProductContent[];
    customerId: number;
    customer: CustomerContent;
    deleted?: boolean;
    createdBy?: number;
    updatedBy?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface OrderProductContent {
    productId: number;
    product: ProductContent;
    order: OrderContent;
    orderId: number;
    quantity: number;
    deleted?: boolean;
    createdBy?: number;
    updatedBy?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ProductItemInput {
    product: ProductContent,
    quantity: number;
}

export interface OrderProducts {
    productId: number;
    orderId: number;
    quantity: number;
    createdBy: number;
}

export interface TicketInput {
    full_name: string;
    username: string;
    message: string;
}

export interface UpdateReportInput {
    title: string;
    content: string;
    img: string;
    icon: string;
    color: string;
}

export interface UpdateReportContent {
    id: number;
    title: string;
    content: string;
    img: string;
    icon: string;
    color: string;
    created_at: Date;
}

export interface ExcelRow {
[key: string]: string | number | boolean | null;
}