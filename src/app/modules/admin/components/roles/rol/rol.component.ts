import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogRef,DynamicDialogConfig } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { Button } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';
import { TooltipOptions } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { NgIf } from '@angular/common';
import { RolesService } from '../../../services/roles/roles.service';
import { Rol } from '../../../interfaces/rol';
import { Message } from 'primeng/message';


@Component({
    selector: 'app-rol',
    imports: [InputTextModule, ReactiveFormsModule, TextareaModule, ToggleButtonModule, Button, Tooltip, NgIf, ConfirmDialogModule, Message],
    templateUrl: './rol.component.html',
    styleUrl: './rol.component.scss'
})
export class RolComponent implements OnInit {
    private formBuilder = inject(FormBuilder);
    private dialogRef = inject(DynamicDialogRef);
    private dialogConfig = inject(DynamicDialogConfig);
    private rolService = inject(RolesService);
    mainForm!: FormGroup;
    availableList: any[] = [];
    dialogMode: 'create' | 'update' | 'delete' = 'create';
    httpLoading: boolean = false;
    rol!: Rol;

    constructor(
        @Inject('DefaultTooltipOptions') public tooltipOption: TooltipOptions
    ) {}

    ngOnInit(): void {
        this.buildModal();
        this.loadAvailable();
    }

    buildModal(): void {
        this.dialogMode = this.dialogConfig.data.mode;
        switch (this.dialogMode) {
            case 'create':
                this.buildMainForm();
                break;
            case 'update':
            case 'delete':
                this.rol = this.dialogConfig.data.entity;
                this.buildUpdateForm();
                break;
        }
    }

    createRol(): void {
        let formValue = this.mainForm.value;
        let formData: any = {
            name: formValue.name,
            description: formValue.description,
            isActive: formValue.isActive
        };
        this.httpLoading = true;
        this.rolService.create(formData).subscribe({
            next: (res) => {
                this.dialogRef?.close(res);
            },
            complete: () => {
                this.httpLoading = false;
            }
        });
    }

    updateRol(): void {
        const valueForm = this.mainForm.value;
        this.rol.name = valueForm.name;
        this.rol.description = valueForm.description;
        this.rol.isActive = valueForm.isActive;

        this.httpLoading = true;
        this.rolService.update(this.rol).subscribe({
            next: (res) => {
                this.dialogRef?.close(true);
                this.httpLoading = false;
            },
            error: (err) => {
                this.httpLoading = false;
            }
        });
    }

    deleteRol(): void {
        this.httpLoading = true;
        this.rolService.delete(this.rol).subscribe({
            next: (res) => {
                this.dialogRef?.close(true);
                this.httpLoading = false;
            },
            error: (err) => {
                this.httpLoading = false;
            }
        });
    }

    exitModal(): void {
        this.dialogRef?.close();
    }

    private buildMainForm(): void {
        this.mainForm = this.formBuilder.group({
            name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            description: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(250)]],
            isActive: [true, [Validators.required]]
        });
    }

    private buildUpdateForm(): void {
        this.mainForm = this.formBuilder.group({
            name: [this.rol.name, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            description: [this.rol.description, [Validators.required, Validators.minLength(2), Validators.maxLength(250)]],
            isActive: [this.rol.isActive, [Validators.required]]
        });
    }

    private loadAvailable(): void {
        this.availableList = [
            { label: 'Activo', value: true },
            { label: 'Inactivo', value: false }
        ];
    }
}
