import { Permission } from '../../admin/interfaces/permission';
import { Menu } from '../../admin/interfaces/menu';
import { UserState } from '@auth/interfaces/user-state';
import { Area } from '../../admin/interfaces/area';

export interface AuthUser {
    state:UserState;
    permissions: Permission[];
    menus: Menu[];
    areas: Area[];
}
