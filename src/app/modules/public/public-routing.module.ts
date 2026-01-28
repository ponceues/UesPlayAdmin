import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResourcesComponent } from './components/resources/resources.component';
import { ResourceComponent } from '@public/components/resource/resource.component';

const routes: Routes = [
    {
        path:'',
        component: ResourcesComponent,
        pathMatch:'full',
    },
    {
        path:'recurso',
        component: ResourceComponent,
        pathMatch:'full',
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GuestRoutingModule { }
