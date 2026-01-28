export interface Menu {
    menuId:string;
    name:string;
    icon:string;
    route:string|null;
    parentId:string|null;
    createdAt:Date;
}
