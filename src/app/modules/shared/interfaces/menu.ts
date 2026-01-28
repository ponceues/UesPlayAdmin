export interface Menu {
    menuId: string;
    name: string;
    icon: string;
    route: string;
    parentId: string | null;
    children?: Menu[];
}
