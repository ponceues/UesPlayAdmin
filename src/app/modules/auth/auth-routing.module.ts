import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import { VerifyAccountComponent } from '@auth/components/verify-account/verify-account.component';
import { ForgotPasswordComponent } from '@auth/components/forgot-password/forgot-password.component';

const routes: Routes = [
    {
        path: '',
        component: LoginComponent,
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'verify-account',
        component: VerifyAccountComponent
    },
    {
        path: 'reset-password',
        component: ForgotPasswordComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AuthRoutingModule { }

