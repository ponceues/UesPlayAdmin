import { Component, inject, OnInit } from '@angular/core';
import { AppFloatingConfigurator } from '../../../../layout/component/app.floatingconfigurator';
import { Button } from 'primeng/button';
import { Message } from 'primeng/message';
import { NgIf } from '@angular/common';
import { Password } from 'primeng/password';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@auth/services/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { MessageService, TooltipOptions } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify-account',
  imports: [
      AppFloatingConfigurator,
      Button,
      Message,
      NgIf,
      Password,
      ReactiveFormsModule
  ],
  templateUrl: './verify-account.component.html',
  styleUrl: './verify-account.component.scss'
})
export class VerifyAccountComponent implements OnInit {
    private authService: AuthService = inject(AuthService);
    private formBuilder: FormBuilder = inject(FormBuilder);
    private route: ActivatedRoute = inject(ActivatedRoute);
    private messageService: MessageService = inject(MessageService);
    private router: Router = inject(Router);

    httpLoading:boolean = false;
    loginForm!: FormGroup;
    validIdentity: boolean|null = null;

    ngOnInit(): void {
        this.route.queryParams.subscribe((params) => {
            let identity = params['identity'];
            let code = params['code'];
            this.buildLoginForm(identity,code)
        });
    }

    verifyAccount():void{
        let request:any = this.loginForm.value;
        this.httpLoading = true;
        this.authService.verifyAccount(request).subscribe({
            next: response => {
                this.httpLoading = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Exito',
                    detail: 'Se ha completado la verficiacion de cuenta',
                    key: 'main'
                });

                //agregarmos . . .
                setTimeout(() => {
                    this.router.navigate(['/auth/login']);

                },3000);
            },
            error: error => {
                this.httpLoading = false;
            }

        })
    }

    private buildLoginForm(identity:string, code:string): void {
        this.loginForm = this.formBuilder.group({
            identity:[identity, [Validators.required]],
            code:[code,[Validators.required]],
            password: [null, [Validators.required, Validators.minLength(6)]],
            password_confirmation: [null, [Validators.required, Validators.minLength(6)]]
        });
    }
}
