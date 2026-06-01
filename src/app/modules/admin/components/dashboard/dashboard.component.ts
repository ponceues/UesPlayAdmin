import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Summary } from '@admin/interfaces/sumary';
import { SharedModule } from '@shared/shared.module';
import { AppStorageService } from '@shared/services/app-storage/app-storage.service';
import { DashboardService } from '../../../services/dashboard/dashboard.service';
import { UsersService } from '@admin/services/users/users.service';
import { AreasService } from '@admin/services/areas/areas.service';
import { RolesService } from '@admin/services/roles/roles.service';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DeviceService } from '@admin/services/devices/device.service';
import { PlatformService } from '@admin/services/platforms/platform.service';
import { LicensesService } from '@admin/services/licenses/licences.service';


@Component({
    selector: 'app-dashboard',
    imports: [CommonModule, SharedModule],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
    private userService: UsersService = inject(UsersService);
    private areaService: AreasService = inject(AreasService);
    private rolesService: RolesService = inject(RolesService);
    private devicesService: DeviceService = inject(DeviceService);
    private platformService: PlatformService = inject(PlatformService);
    private licenceService: LicensesService = inject(LicensesService);
    private appStorageService: AppStorageService = inject(AppStorageService);

    private permissions: string[] = [];
    public summaryList: Summary[] = [];
    public loading: boolean = false;

    ngOnInit() {
        this.permissions = this.appStorageService.getPermissions().filter((x) =>
            ['search', 'list'].some(keyword => x.includes(keyword))
        );
        this.loadSummaries();
    }

    private loadSummaries(): void {
        this.loading = true;
        const summaryRequests: { [key: string]: Observable<Summary> } = {};
        const permissionMap = [
            {
                permission: 'can.list.roles',
                key: 'roles',
                service: () => this.rolesService.summary(),
                entity: 'Roles',
                icon: 'cog',
                color: 'text-purple-500'
            },
            {
                permission: 'can.search.users',
                key: 'users',
                service: () => this.userService.summary(),
                entity: 'Users',
                icon: 'users',
                color: 'text-blue-500'
            },
            {
                permission: 'can.search.areas',
                key: 'areas',
                service: () => this.areaService.summary(),
                entity: 'Areas',
                icon: 'layout-grid',
                color: 'text-orange-500'
            },
            {
                permission: 'can.list.devices',
                key: 'devices',
                service: () => this.devicesService.summary(),
                entity: 'Dispositivos',
                icon: 'Cpu',
                color: 'text-gray-500'
            },
            {
                permission: 'can.list.platforms',
                key: 'platforms',
                service: () => this.platformService.summary(),
                entity: 'Plataformas',
                icon: 'Monitor',
                color: 'text-indigo-500'
            },
            {
                permission: 'can.search.licenses',
                key: 'licenses',
                service: () => this.licenceService.summary(),
                entity: 'Licencias',
                icon: 'Tags',
                color: 'text-teal-500'
            }
        ];

        permissionMap.forEach(config => {
            if (this.hasPermission(config.permission)) {
                summaryRequests[config.key] = config.service().pipe(
                    catchError(() => of({ entity: config.entity, total: 0, active: 0, icon: config.icon, color: config.color }))
                );
            }
        });

        if (Object.keys(summaryRequests).length > 0) {
            forkJoin(summaryRequests).subscribe({
                next: (results) => {
                    this.summaryList = [];
                    permissionMap.forEach(config => {
                        if (results[config.key]) {
                            const summary = results[config.key];
                            this.summaryList.push({
                                entity: config.entity,
                                total: summary.total,
                                active: summary.active,
                                icon: config.icon,
                                color: config.color
                            });
                        }
                    });

                    this.loading = false;
                },
                error: () => {
                    this.loading = false;
                }
            });
        } else {
            this.loading = false;
        }
    }

    private hasPermission(permission: string): boolean {
        return this.permissions.some(p => p === permission);
    }

}
