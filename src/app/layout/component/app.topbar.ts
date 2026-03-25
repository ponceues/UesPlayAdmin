import { Component, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';
import { TieredMenu } from 'primeng/tieredmenu';
import { Router } from '@angular/router';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator,TieredMenu],
    template: `
        <div class="layout-topbar">
            <div class="layout-topbar-logo-container">
                <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                    <i class="pi pi-bars"></i>
                </button>
                <a class="layout-topbar-logo" routerLink="/admin">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="120" height="120" fill="rgba(139,14,19,1)"><path d="M19.376 12.4161L8.77735 19.4818C8.54759 19.635 8.23715 19.5729 8.08397 19.3432C8.02922 19.261 8 19.1645 8 19.0658V4.93433C8 4.65818 8.22386 4.43433 8.5 4.43433C8.59871 4.43433 8.69522 4.46355 8.77735 4.5183L19.376 11.584C19.6057 11.7372 19.6678 12.0477 19.5146 12.2774C19.478 12.3323 19.4309 12.3795 19.376 12.4161Z"></path></svg>
                    <span style="color: #8B0E13">UESPLAY</span>
                </a>
            </div>

            <div class="layout-topbar-actions">
                <div class="layout-config-menu">
                    <app-configurator />
                </div>

                <button class="layout-topbar-menu-button layout-topbar-action" pStyleClass="@next"
                        enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden"
                        leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true">
                    <i class="pi pi-ellipsis-v"></i>
                </button>

                <div class="layout-topbar-menu hidden lg:block">
                    <div class="layout-topbar-menu-content">
                        <button (click)="usrOpt.toggle($event)"
                                type="button"
                                class="layout-topbar-action">
                            <i class="pi pi-user"></i>

                        </button>
                        <p-tieredmenu #usrOpt
                                      [model]="usrOptions"
                                      [popup]="true">
                        </p-tieredmenu>
                    </div>
                </div>
            </div>
        </div>`
})
export class AppTopbar {
    router:Router = inject(Router);
    items!: MenuItem[];
    usrOptions: MenuItem[] = [
        {
            label: 'Perfil',
            icon: 'pi pi-cog',
            routerLink: '/admin/profile',
        },
        {
            label: 'Salir',
            icon: 'pi pi-power-off',
            command:()=>{
                this.closeSession();
            }
        }
    ];

    constructor(public layoutService: LayoutService) {}

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    closeSession():void{
        localStorage.clear();
        this.router.navigate(['/auth/login']);
    }
}
