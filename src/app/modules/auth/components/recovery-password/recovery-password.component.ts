import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIf } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';

import { AuthService } from '@auth/services/auth/auth.service';
import { AppConfigurator } from '../../../../layout/component/app.configurator';

@Component({
  selector: 'app-recovery-password',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    MessageModule,
    NgIf,
    AppConfigurator
  ],
  templateUrl: './recovery-password.component.html',
  styleUrl: './recovery-password.component.scss'
})
export class RecoveryPasswordComponent implements OnInit {
  private formBuilder: FormBuilder = inject(FormBuilder);
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private authService: AuthService = inject(AuthService);

  recoveryForm!: FormGroup;
  httpLoading: boolean = false;
  showErrorMessage: boolean = false;
  showSuccessMessage: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  // Parámetros de la URL
  identity: string = '';
  code: string = '';

  ngOnInit(): void {
    // Capturar parámetros de la URL
    this.route.queryParams.subscribe(params => {
      this.identity = params['identity'] || '';
      this.code = params['code'] || '';
    });

    this.buildRecoveryForm();

    // Resetear mensajes cuando el usuario modifica el formulario
    this.recoveryForm.valueChanges.subscribe(() => {
      if (this.showErrorMessage) {
        this.showErrorMessage = false;
      }
      if (this.showSuccessMessage) {
        this.showSuccessMessage = false;
      }
    });
  }

  private buildRecoveryForm(): void {
    this.recoveryForm = this.formBuilder.group(
        {
            password: [null, [Validators.required, Validators.minLength(6)]],
            password_confirmation: [null, [Validators.required]]
        },
        {
            validators: this.passwordMatchValidator
        }
    );
  }

  // Validador personalizado para verificar que las contraseñas coincidan
  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const verifyPassword = control.get('password_confirmation');

    if (!password || !verifyPassword) {
      return null;
    }

    if (verifyPassword.value === '') {
      return null;
    }

    return password.value === verifyPassword.value ? null : { passwordMismatch: true };
  }

  resetPasswordFn(): void {
    if (this.recoveryForm.invalid) {
      return;
    }

    if (!this.identity || !this.code) {
      this.showErrorMessage = true;
      this.errorMessage = 'Parámetros de recuperación inválidos. Por favor, utiliza el enlace enviado a tu correo.';
      return;
    }

    this.httpLoading = true;
    this.showErrorMessage = false;
    this.showSuccessMessage = false;

    const request = {
        identity: this.identity,
        code: this.code,
        password: this.recoveryForm.value.password,
        password_confirmation: this.recoveryForm.value.password_confirmation
    };

    this.authService.resetPassword(request).subscribe({
      next: () => {
        this.httpLoading = false;
        this.showSuccessMessage = true;
        this.successMessage = 'Contraseña actualizada exitosamente.';

      },
      error: (err) => {
        this.httpLoading = false;
        const errorCode = err.code || err.status;
        const errorMessage = err.message || err.error?.message;

        if (errorCode === 400) {
          this.showErrorMessage = true;
          this.errorMessage = errorMessage || 'El enlace de recuperación es inválido o ha expirado.';
        } else {
          this.showErrorMessage = true;
          this.errorMessage = errorMessage || 'Error al restablecer la contraseña. Por favor, intenta nuevamente.';
        }
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
