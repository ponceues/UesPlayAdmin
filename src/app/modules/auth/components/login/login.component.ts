import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { Router } from '@angular/router';
import { MessageModule } from 'primeng/message';
import { NgIf } from '@angular/common';
import { AuthService } from '@auth/services/auth/auth.service';
import { AppStorageService } from '@shared/services/app-storage/app-storage.service';
import { AppConfigurator } from '../../../../layout/component/app.configurator';

@Component({
    selector: 'app-login',
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, ReactiveFormsModule, MessageModule, NgIf, AppConfigurator],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    private localStorageService: AppStorageService = inject(AppStorageService);
    private authService: AuthService = inject(AuthService);
    private formBuilder: FormBuilder = inject(FormBuilder);
    private router: Router = inject(Router);

    httpLoading: boolean = false;
    loginForm!: FormGroup;
    showErrorMessage: boolean = false;
    errorMessage: string = '';

    constructor() {}

    ngOnInit(): void {
        this.buildLoginForm();

        // Resetear mensaje de error cuando el usuario modifica el formulario
        this.loginForm.valueChanges.subscribe(() => {
            if (this.showErrorMessage) {
                this.showErrorMessage = false;
            }
        });
    }

    loginFn(): void {
        let request = this.loginForm.value;
        this.httpLoading = true;
        this.showErrorMessage = false; // Resetear mensaje de error
        this.authService.login(request).subscribe({
            next: (res) => {
                this.localStorageService.setItem('authJwt', JSON.stringify(res));
                this.loadAndSaveUserInfo();
            },
            error: (err) => {
                this.httpLoading = false;

                // El error puede venir con diferentes estructuras
                const errorCode = err.code || err.status;
                const errorMessage = err.message || err.error?.message;

                if (errorCode === 403) {
                    this.showErrorMessage = true;
                    this.errorMessage = errorMessage || 'Acceso denegado. No tienes autorización para ingresar al sistema.';
                } else if (errorCode === 401) {
                    this.showErrorMessage = true;
                    this.errorMessage = errorMessage || 'Credenciales incorrectas. Verifica tu correo y contraseña.';
                } else if (err) {
                    // Mostrar cualquier error de autenticación
                    this.showErrorMessage = true;
                    this.errorMessage = errorMessage || 'Error al iniciar sesión. Por favor, intenta nuevamente.';
                }
            }
        });
    }

    goToStart(): void {
        this.router.navigate(['/']);
    }

    goToResetPw(): void {
        this.router.navigate(['/auth/reset-password']);
    }

    loadAndSaveUserInfo(): void {
        this.authService.getUserInformation().subscribe({
            next: (res) => {
                this.localStorageService.setItem('menus', JSON.stringify(res.menus));
                this.localStorageService.setItem('areas', JSON.stringify(res.areas));
                this.localStorageService.setItem('user', JSON.stringify(res.state));
                const permissionCodes = res.permissions?.map((permission: any) => permission.code) || [];
                this.localStorageService.setItem('permissions', JSON.stringify(permissionCodes));
                this.router.navigate(['/admin']);
            },
            error: () => {
                this.httpLoading = false;
            }
        });
    }

    private buildLoginForm(): void {
        this.loginForm = this.formBuilder.group({
            email: [null, [Validators.required, Validators.email]],
            password: [null, [Validators.required, Validators.minLength(6)]]
        });
    }
}
