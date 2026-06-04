import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { NgIf } from '@angular/common';
import { AuthService } from '@auth/services/auth/auth.service';
import { AppConfigurator } from '../../../../layout/component/app.configurator';

@Component({
  selector: 'app-forgot-password',
  imports: [
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    Message,
    NgIf,
    AppConfigurator
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  private authService: AuthService = inject(AuthService);
  private formBuilder: FormBuilder = inject(FormBuilder);
  private router: Router = inject(Router);

  failed:boolean | null = null;

  httpLoading: boolean = false;
  resetPasswordForm!: FormGroup;

  ngOnInit(): void {
    this.buildResetPasswordForm();
  }

  resetPasswordFn(): void {
    if (this.resetPasswordForm.invalid) {
      return;
    }

    const request = this.resetPasswordForm.value;
    this.httpLoading = true;
    this.failed = null;

    this.authService.sendResetPasswordRequest(request).subscribe({
      next: (res) => {
        this.httpLoading = false;
        this.failed = false;
        setTimeout(() => {
            this.router.navigate(['/auth/login']);
        }, 5000);
      },
      error: (err) => {
        this.failed = true;
        this.httpLoading = false;
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  goToStart(): void {
    this.router.navigate(['/']);
  }

  private buildResetPasswordForm(): void {
    this.resetPasswordForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]]
    });
  }
}
