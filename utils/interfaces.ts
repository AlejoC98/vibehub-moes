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
    email?: string;
    roleId?: number;
    username?: string;
    location?: LocationContent;
    password?: string;
    deleted?: boolean;
    account?: AccountContent;
    role?: RoleContent;
    createdBy: number;
    createdAt: Date;
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
    customers?: CustomerContent[];
    products?: ProductContent[];
    racks?: RackContent[];
    positions?: PositionContent[];
    notifications?: NotificationContent[];
    orders?: OrderContent[];
    userAccount?: AccountContent;
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
    unit_price: number;
    total_price: number;
    // quantity?: number;
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
    sku?: string;
    columns: string;
    rows: string;
    product?: ProductContent[];
    name?: string;
    position?: PositionContent[];
}

export interface ReceivingContent {
    sku: string;
    name?: string;
    quantity: number;
    condition: string;
    locationId: number;
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
    content: string;
    icon: string;
    usernotificationstatus: NotificationStatusContent[];
    linkTo: string;
    reference: string;
    deleted?: boolean;
    createdBy?: number;
    updatedBy?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface NotificationStatusContent {
    id: number;
    userId: number;
    notificationId: number;
    open: boolean;
    deleted?: boolean;
    createdBy?: number;
    updatedBy?: number;
    createdAt?: Date;
    updatedAt?: Date;
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