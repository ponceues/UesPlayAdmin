import { Component, inject, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { Menu } from '@shared/interfaces/menu';
import { AppStorageService } from '@shared/services/app-storage/app-storage.service';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];
    private appStorageService: AppStorageService = inject(AppStorageService);

    ngOnInit() {

        this.model = [
            {
                label: 'Inicio',
                items: [
                    {
                        label: 'UesPlay',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['/admin']
                    }
                ]
            }
        ];
        this.buildMenu();
    }

    buildMenu():void{
        const appMenus = this.appStorageService.getMenus();
        if(appMenus !== null){

            let mainMenus: Menu[] = appMenus.filter(item => item.parentId === null);

            let adminMenu: MenuItem = {
                label: 'Administracion',
                items: []
            };

            mainMenus.forEach(item => {
                let mainMenuItem : MenuItem ={
                    label: item.name,
                    icon: item.icon,
                    items: []
                }

                let childerns = appMenus.filter(x => x.parentId === item.menuId);
                childerns.forEach(child => {
                    let childMenu : MenuItem ={
                        label: child.name,
                        icon: child.icon,
                        routerLink: [child.route]
                    }
                    mainMenuItem.items?.push(childMenu);
                });

                adminMenu.items!.push(mainMenuItem);
            });
            this.model.push(adminMenu);
        }

    }
}
