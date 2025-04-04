import { Dayjs } from "dayjs";
import { ReactNode } from "react";

export interface Role {
    id: number,
    name: string;
}

export interface MenuItem {
    id: number,
    title: string;
    to: string;
    icon: ReactNode;
    submenu?: MenuItem[] | [];
}

export interface AccountContent {
    first_name?: string;
    last_name?: string;
    email?: string;
    username?: string;
    role?: Role;
    // user?: UserContent;
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

export interface UserContent {
    id?: number;
    firstName: string;
    lastName: string;
    email?: string;
    roleId?: number;
    username?: string;
    // location?: LocationContent;
    // password?: string;
    // deleted?: boolean;
    // account?: AccountContent;
    // role?: RoleContent;
    // createdBy: number;
    // createdAt: Date;
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
    users?: UserContent[];
    vendors?: VendorContent[];
    products?: ProductContent[];
    racks?: RackContent[];
    positions?: PositionContent[];
    notifications?: NotificationContent[];
    orders?: OrderContent[];
    userAccount?: AccountContent;
    receivings?: ReceivingContent[];
    shippings?: ShippingContent[];
    isLaunching: boolean;
    setIsLaunching: (status: boolean) => void
}

export interface LocationContent {
    id: number;
    name: string;
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

export interface ProductContent {
    id?: number;
    img?: string;
    sku?: string;
    name?: string;
    unit_price?: number;
    total_price?: number;
    quantity?: number;
    // rackId: number;
    // positions: PositionProductContent[];
    // createdBy: number | UserContent;
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
    vendors?: VendorContent[];
    status: string;
    // items: Array<{product_id: string, quantity: number}>;
}

export interface PickingContent {
    id?: number;
    order_number?: number;
    assign_to?: number;
    due_at?: Date;
    priority?: string;
    notes?: string;
    created_at?: Date;
}

export interface PickingProductContent {
    product_id?: number;
    name: string;
    quantity?: number;
}

export interface ReceivingProductsInput extends ProductContent {
    product_id?: number;
    id?: number;
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

export interface ShippingContent {
    pl_number: number;
    carrier: string;
    trailer_number: string;
    shipped_out_at: Dayjs;
    picker_name: string;
    verified_by: string;
    bol_number: string;
    status: string;
    notes: string;
    shipped_quantity?: number;
    created_at: string;
    shippings_products:
    { id: number, created_at: string, product_sku: string, shipping_id: number, product_quantity: number }[];
}
export interface ShippingInput {
    pl_number: number;
    carrier: string;
    trailer_number: string;
    shipped_out_at: Dayjs;
    picker_name: string;
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

export interface NotificationContent {
    id: number;
    title: string;
    text: string;
    type: string;
    status: string;
    created_by: number;
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

export interface VendorContent {
    id: number;
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

export interface OrderProductInput {
    product: ProductContent,
    quantity: number;
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