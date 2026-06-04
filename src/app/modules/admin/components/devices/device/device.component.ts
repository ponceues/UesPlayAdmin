import { Component, Inject, inject } from '@angular/core';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { NgForOf, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { Tooltip } from 'primeng/tooltip';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TooltipOptions } from 'primeng/api';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ToggleButton } from 'primeng/togglebutton';

import { DeviceService } from '@admin/services/devices/device.service';
import { Device } from '@admin/interfaces/device';

@Component({
    selector: 'app-devices',
    imports: [Button, InputText, MessageModule, NgIf, ReactiveFormsModule, Tooltip, TextareaModule, ToggleSwitchModule, ToggleButton, NgForOf],
    templateUrl: './device.component.html',
    styleUrl: './device.component.scss'
})
export class DeviceComponent {
    private formBuilder = inject(FormBuilder);
    private dialogRef = inject(DynamicDialogRef);
    private dialogConfig = inject(DynamicDialogConfig);
    private deviceService: DeviceService = inject(DeviceService);

    dialogMode: 'create' | 'update' | 'delete' = 'create';
    httpLoading: boolean = false;
    selectedEntity!: Device;
    entityForm!: FormGroup;
    iconList: any[] = [];

    constructor(@Inject('DefaultTooltipOptions') public tooltipOption: TooltipOptions) {}

    ngOnInit() {
        this.dialogMode = this.dialogConfig.data.mode;

        if (this.dialogMode != 'create') {
            this.selectedEntity = this.dialogConfig.data.entity;
        }
        this.buildForm();
        this.seIconList();
    }

    create(): void {
        this.httpLoading = true;
        let request = this.entityForm.value;
        this.deviceService.create(request).subscribe({
            next: (data: any) => {
                this.entityForm.reset();
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
        let request = this.entityForm.value;
        this.selectedEntity.name = request.name;
        this.selectedEntity.description = request.description;
        this.selectedEntity.active = request.active;
        this.selectedEntity.icon = request.icon;
        this.deviceService.update(this.selectedEntity).subscribe({
            next: (data: any) => {
                this.entityForm.reset();
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
        this.deviceService.delete(this.selectedEntity).subscribe({
            next: (data: any) => {
                this.entityForm.reset();
                this.httpLoading = false;
                this.dialogRef.close(data);
            },
            error: () => {
                this.httpLoading = false;
            }
        });
    }

    setIcon(icon:string): void {

        this.entityForm.get('icon')?.setValue(icon);
        console.log(this.entityForm.value);
    }

    seIconList(): void {
        this.iconList = [
            { value: 'pi pi-users' },
            { value: 'pi pi-cog' },
            { value: 'pi pi-inbox' },
            { value: 'pi pi-microchip-ai' },
            { value: 'pi pi-images' },
            { value: 'pi pi-link' },
            { value: 'pi pi-id-card' },
            { value: 'pi pi-sitemap' },
            { value: 'pi pi-stopwatch' },
            { value: 'pi pi-trophy' }
        ];
    }

    exitModal(): void {
        this.dialogRef.close();
    }

    private buildForm(): void {
        switch (this.dialogMode) {
            case 'create':
                this.entityForm = this.formBuilder.group({
                    name: [null, [Validators.required, Validators.minLength(3)]],
                    active: [false, [Validators.required]],
                    description: [null],
                    icon: [null, [Validators.required]]
                });
                break;
            case 'update':
            case 'delete':
                this.entityForm = this.formBuilder.group({
                    name: [this.selectedEntity.name, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
                    active: [this.selectedEntity.active, [Validators.required]],
                    description: [this.selectedEntity.description],
                    icon: [this.selectedEntity.icon, [Validators.required]]
                });
                break;
        }
    }
}
