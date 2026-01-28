import { Component, inject, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { RolesService } from '../../../services/roles/roles.service';
import { MenuService } from '../../../services/menus/menu.service';
import { Menu } from '../../../interfaces/menu';
import { Rol } from '../../../interfaces/rol';
import { Filter } from '@shared/interfaces/filter';
import {forkJoin} from 'rxjs';
import { NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { PickListModule } from 'primeng/picklist';
import { MessageModule } from 'primeng/message';
import { PicklistSkeletonComponent } from '@shared/components/picklist-skeleton/picklist-skeleton.component';
import { Result } from '@shared/interfaces/result';
import { MessageService } from 'primeng/api';
import { Permission } from '../../../interfaces/permission';
import { PermissionService } from '../../../services/permissions/permission.service';
import { Envelop } from '@shared/interfaces/envelop';
import { Skeleton } from 'primeng/skeleton';

@Component({
    selector: 'app-settings',
    imports: [ReactiveFormsModule, TableModule, PickListModule, NgIf, PicklistSkeletonComponent, MessageModule, Skeleton],
    templateUrl: './settings.component.html',
    styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
    private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
    private menuService: MenuService = inject(MenuService);
    private rolService: RolesService = inject(RolesService);
    private permissionService: PermissionService = inject(PermissionService);
    private messageService: MessageService = inject(MessageService);

    loadingMenus: boolean = false;
    loadingPermissions: boolean = false;
    selectedRol!: Rol;
    menus: Menu[] = [];
    permissionsList: Permission[] = [];
    sourceMenus: Menu[] = [];
    sourcePermissions: Permission[] = [];

    ngOnInit(): void {
        this.loadingMenus = true;
        this.loadingPermissions = true;
        this.activatedRoute.params.subscribe((params) => {
            const rolId: string = params['rolId'];
            this.buildComponent(rolId);
        });
    }

    addMenu(event: any): void {
        let menu = event.items[0];
        if (menu === undefined) {
            return;
        }
        this.loadingPermissions = true;
        this.rolService.addMenu(this.selectedRol, menu.menuId).subscribe({
            next: (res) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Exito',
                    detail: 'El menu agregado con exito.',
                    key: 'main'
                });
                this.selectedRol.menus.push(menu);
                this.setPermissionsPickList(this.permissionsList, this.selectedRol.permissions);
            }
        });
    }

    removeMenu(event: any): void {
        let menu: Menu = event.items[0];
        if (menu === undefined) {
            return;
        }
        this.loadingPermissions = true;
        this.rolService.removeMenu(this.selectedRol, menu).subscribe({
            next: (res: Result) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Exito',
                    detail: 'El menu se ha removido del rol',
                    key: 'main'
                });
                let index = this.selectedRol.menus.indexOf(menu);
                if (index > -1) {
                    this.selectedRol.menus.splice(index, 1);
                }
                this.setPermissionsPickList(this.permissionsList, this.selectedRol.permissions);
            },
            error: (err) => {
                this.loadingPermissions = false;
            }
        });
    }

    addPermission(event: any): void {
        let permission: Permission = event.items[0];
        if (permission === undefined) {
            return;
        }

        this.rolService.addPermission(this.selectedRol, permission).subscribe({
            next: (res) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Exito',
                    detail: 'El permiso se ha agregado al rol.',
                    key: 'main'
                });
            }
        });
    }

    removePermission(event: any): void {
        let permission: Permission = event.items[0];
        if (permission === undefined) {
            return;
        }

        this.rolService.removePermission(this.selectedRol, permission).subscribe({
            next: (res: Result) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Exito',
                    detail: 'El permiso se ha removido del rol',
                    key: 'main'
                });
            }
        });
    }

    private buildComponent(rolId: string): void {
        const filter: Filter = new Filter();
        filter.pageSize = 1000;

        const menuRequest = this.menuService.fetch(filter);
        const permissionRequest = this.permissionService.fetch(filter);
        const rolRequest = this.rolService.findById(rolId);

        forkJoin([permissionRequest, menuRequest, rolRequest]).subscribe({
            next: ([permissionResult, menuResult, rolResult]) => {
                this.menus = menuResult.menus;
                this.permissionsList = permissionResult.permissions;
                this.selectedRol = rolResult;
                this.setMenusPickList(menuResult.menus, rolResult.menus);
                this.setPermissionsPickList(permissionResult.permissions, rolResult.permissions);
            }
        });
    }

    private setMenusPickList(source: Menu[], target: Menu[]): void {
        source.forEach((menu) => {
            let item = target.filter((x) => x.menuId === menu.menuId)[0];
            if (item === undefined) {
                this.sourceMenus.push(menu);
            }
        });
        this.loadingMenus = false;
    }

    private setPermissionsPickList(source: Permission[], target: Permission[]): void {
        let permissions: Permission[] = [];
        this.sourcePermissions = [];
        this.selectedRol.menus.forEach((menu: Menu) => {
            let menuPermissions: Permission[] = source.filter((permission: Permission) => permission.menuId === menu.menuId);
            menuPermissions.forEach((permissionItem) => {
                permissions.push(permissionItem);
            });
        });

        permissions.forEach((permission: Permission): void => {
            let item: Permission = this.selectedRol.permissions.filter((x: Permission) => x.permissionId === permission.permissionId)[0];
            if (item === undefined) {
                this.sourcePermissions.push(permission);
            }
        });

        this.sourcePermissions.forEach((permission: Permission) => {
            let menu = this.menus.find((x) => x.menuId === permission.menuId);
            permission.menu = menu === undefined ? null : menu;
        });

        this.selectedRol.permissions.forEach((permission: Permission) => {
            let menu = this.menus.find((x) => x.menuId === permission.menuId);
            permission.menu = menu === undefined ? null : menu;
        });

        this.loadingPermissions = false;
    }
}
