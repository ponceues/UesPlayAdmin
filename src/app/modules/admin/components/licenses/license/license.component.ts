import { Component, Inject, inject } from '@angular/core';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { Tooltip } from 'primeng/tooltip';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TooltipOptions } from 'primeng/api';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ToggleButton } from 'primeng/togglebutton';
import { License } from '@admin/interfaces/license';
import { LicensesService } from '@admin/services/licenses/licences.service';


@Component({
  selector: 'app-license',
  imports: [
      Button,
      InputText,
      Message,
      NgIf,
      ReactiveFormsModule,
      Tooltip,
      TextareaModule,
      ToggleSwitchModule,
      ToggleButton
  ],
  templateUrl: './license.component.html',
  styleUrl: './license.component.scss'
})
export class LicenseComponent {
    private formBuilder = inject(FormBuilder);
    private dialogRef = inject(DynamicDialogRef);
    private dialogConfig = inject(DynamicDialogConfig);
    private licenseService: LicensesService = inject(LicensesService);

    dialogMode: 'create' | 'update' | 'delete' = 'create';
    httpLoading: boolean = false;
    selectedLicense!: License;
    licenseForm!: FormGroup;

    constructor(@Inject('DefaultTooltipOptions') public tooltipOption: TooltipOptions) {}

    ngOnInit() {
        this.dialogMode = this.dialogConfig.data.mode;

        if (this.dialogMode != 'create') {
            this.selectedLicense = this.dialogConfig.data.entity;
        }
        this.buildUserForm();
    }

    create(): void {
        this.httpLoading = true;
        let request = this.licenseForm.value;
        this.licenseService.create(request).subscribe({
            next: (data: any) => {
                this.licenseForm.reset();
                this.httpLoading = false;
                this.dialogRef.close(data);
            },
            error: () => {
                this.httpLoading = false;
            }
        });
    }

    update(): void {
        this.httpLoading = true;
        let request = this.licenseForm.value;
        this.selectedLicense.name = request.name;
        this.selectedLicense.description = request.description;
        this.selectedLicense.enabled = request.enabled;
        this.licenseService.update(this.selectedLicense).subscribe({
            next: (data: any) => {
                this.licenseForm.reset();
                this.httpLoading = false;
                this.dialogRef.close(data);
            },
            error: () => {
                this.httpLoading = false;
            }
        });
    }

    delete(): void {

        this.httpLoading = true;
        this.licenseService.delete(this.selectedLicense).subscribe({
            next: (data: any) => {
                this.licenseForm.reset();
                this.httpLoading = false;
                this.dialogRef.close(data);
            },
            error: () => {
                this.httpLoading = false;
            }
        });
    }

    exitModal(): void {
        this.dialogRef.close();
    }

    private buildUserForm(): void {
        switch (this.dialogMode) {
            case 'create':
                this.licenseForm = this.formBuilder.group({
                    version: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
                    name: [null, [Validators.required, Validators.minLength(3)]],
                    enabled: [false, [Validators.required]],
                    description: ['']
                });
                break;
            case 'update':
            case 'delete':
                this.licenseForm = this.formBuilder.group({
                    name: [this.selectedLicense.name, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
                    version: [this.selectedLicense.version, [Validators.required, Validators.minLength(3)]],
                    enabled: [this.selectedLicense.enabled, [Validators.required]],
                    description: [this.selectedLicense.description]
                });
                break;
        }
    }

}
