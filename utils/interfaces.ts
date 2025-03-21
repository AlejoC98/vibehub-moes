import { ReactNode } from "react";

export interface MenuItem {
    id: number,
    title: string;
    to: string;
    icon: ReactNode;
    submenu?: MenuItem[] | [];
}