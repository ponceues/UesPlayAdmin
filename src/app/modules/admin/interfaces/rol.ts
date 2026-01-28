import { Menu } from './menu';
import {Permission} from './permission';

export interface Rol {
    rolId: string,
    name: string,
    description: string,
    isActive:boolean,
    isDefault: boolean,
    menus:Menu[],
    permissions: Permission[];
    createdAt:Date,
    updatedAt:Date
}
