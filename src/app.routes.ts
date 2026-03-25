import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { PublicLayoutComponent } from '@shared/components/public-layout/public-layout.component';
import { PreviewComponent } from '@admin/components/resources/preview/preview.component';
import { sessionGuard } from './app/guards/session/session.guard';

export const appRoutes: Routes = [
    {
        path: '',
        redirectTo: 'recursos',
        pathMatch: 'full'
    },
    {
        path: 'admin/recursos/preview',
        component: PublicLayoutComponent,
        children: [
            {
                path: '',
                component: PreviewComponent
            }
        ]
    },
    {
        path: 'admin',
        component: AppLayout,
        loadChildren: () => import('./app/modules/admin/admin.module').then((m) => m.AdminModule)
    },
    {
        path: 'recursos',
        component: PublicLayoutComponent,
        loadChildren: () => import('./app/modules/public/public.module').then((m) => m.PublicModule)
    },
    {
        path: 'auth',
        loadChildren: () => import('./app/modules/auth/auth.module').then((m) => m.AuthModule)
    }
];
