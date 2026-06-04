import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {RolesComponent} from './components/roles/roles.component';
import { SettingsComponent } from './components/roles/settings/settings.component';
import { UsersComponent } from './components/users/users.component';
import { SubjectsComponent } from '@admin/components/subjects/subjects.component';
import { DevicesComponent } from '@admin/components/devices/devices.component';
import { PlatformsComponent } from '@admin/components/platforms/platforms.component';
import { ResourcesComponent } from '@admin/components/resources/resources.component';
import { ResourceComponent } from '@admin/components/resources/resource/resource.component';
import { LicensesComponent } from '@admin/components/licenses/licenses.component';
import { MediaTypesComponent } from '@admin/components/media-types/media-types.component';
import { MediaGenresComponent } from '@admin/components/media-genres/media-genres.component';
import { sessionGuard } from '../../guards/session/session.guard';
import { DashboardComponent } from '@admin/components/dashboard/dashboard.component';


const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        canActivate: [sessionGuard]
    },
    {
        path: 'roles',
        component: RolesComponent,
        data: {breadcrumb: 'Roles'},
        canActivate: [sessionGuard]
    },
    {
        path: 'roles/:rolId/settings',
        component:SettingsComponent,
        data: {
            breadcrumb:'Roles / Settings'
        },
        canActivate: [sessionGuard]
    },
    {
        path: 'users',
        component: UsersComponent,
        data: {breadcrumb: 'Usuarios'},
        canActivate: [sessionGuard]
    },
    {
        path: 'courses',
        component: SubjectsComponent,
        data: {breadcrumb: 'Cursos'},
        canActivate: [sessionGuard]
    },
    {
        path: 'devices',
        component: DevicesComponent,
        data: {breadcrumb: 'Dispositivos'},
        canActivate: [sessionGuard]
    },
    {
        path: 'platforms',
        component: PlatformsComponent,
        data: {breadcrumb: 'Plataformas'},
        canActivate: [sessionGuard]
    },
    {
        path: 'licenses',
        component: LicensesComponent,
        data: {breadcrumb: 'Plataformas'},
        canActivate: [sessionGuard]
    },
    {
        path: 'media-types',
        component: MediaTypesComponent,
        data: {breadcrumb: 'Categorias de multimedia'},
        canActivate: [sessionGuard]
    },
    {
        path: 'media-types/:mediaTypeId',
        component: MediaGenresComponent,
        data: {breadcrumb: 'Genero de multimedia'},
        canActivate: [sessionGuard]
    },
    {
        path: 'resources',
        component: ResourcesComponent,
        data: { breadcrumb: 'Recursos' },
        canActivate: [sessionGuard]
    },
    {
        path: 'resources/:resourceId',
        component: ResourceComponent,
        data: { breadcrumb: 'Recursos / Detalle' },
        canActivate: [sessionGuard]
    },
    {
        path: 'resources/:resourceId/preview',
        component: ResourceComponent,
        data: { breadcrumb: 'Recursos / Detalle' },
        canActivate: [sessionGuard]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
