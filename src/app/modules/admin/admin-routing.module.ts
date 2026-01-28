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


const routes: Routes = [
    {
        path: 'roles',
        component: RolesComponent,
        data: {breadcrumb: 'Roles'},
    },
    {
        path: 'roles/:rolId/settings',
        component:SettingsComponent,
        data: {
            breadcrumb:'Roles / Settings'
        }
    },
    {
        path: 'users',
        component: UsersComponent,
        data: {breadcrumb: 'Usuarios'},
    },
    {
        path: 'courses',
        component: SubjectsComponent,
        data: {breadcrumb: 'Cursos'},
    },
    {
        path: 'devices',
        component: DevicesComponent,
        data: {breadcrumb: 'Dispositivos'},
    },
    {
        path: 'platforms',
        component: PlatformsComponent,
        data: {breadcrumb: 'Plataformas'},
    },
    {
        path: 'licenses',
        component: LicensesComponent,
        data: {breadcrumb: 'Plataformas'},
    },
    {
        path: 'media-types',
        component: MediaTypesComponent,
        data: {breadcrumb: 'Categorias de multimedia'},
    },
    {
        path: 'media-types/:mediaTypeId',
        component: MediaGenresComponent,
        data: {breadcrumb: 'Genero de multimedia'},
    },
    {
        path: 'resources',
        component: ResourcesComponent,
        data: { breadcrumb: 'Recursos' },
    },
    {
        path: 'resources/:resourceId',
        component: ResourceComponent,
        data: { breadcrumb: 'Recursos / Detalle' },
    },
    {
        path: 'resources/:resourceId/preview',
        component: ResourceComponent,
        data: { breadcrumb: 'Recursos / Detalle' },
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
