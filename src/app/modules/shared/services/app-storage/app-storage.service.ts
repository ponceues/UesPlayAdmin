import { Injectable } from '@angular/core';
import { Menu } from '@shared/interfaces/menu';
@Injectable({
  providedIn: 'root'
})
export class AppStorageService {
    private permissionKey:string = 'permissions';
    private menusKey:string = 'menus';
    constructor() { }

    setItem(key: string, value: string): void {
        localStorage.setItem(key, value);
    }
    getItem(key: string): string | null {
        return localStorage.getItem(key);
    }

    removeItem(key: string): void {
        localStorage.removeItem(key);
    }

    clear(): void {
        localStorage.clear();
    }

    getPermissions(): string[] {
        const permissions = this.getItem(this.permissionKey);
        return permissions ? JSON.parse(permissions) : [];
    }

    getMenus(): Menu[] {
        const menus = this.getItem(this.menusKey);
        return menus ? JSON.parse(menus) : [];
    }
}
