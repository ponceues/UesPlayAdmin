import { Menu } from './menu';
export interface Permission {
    permissionId:string;
    code:string;
    name:string;
    menuId:string;
    menu:Menu|null;
}
