import { Component, Inject, inject } from '@angular/core';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TooltipOptions } from 'primeng/api';
import { TextareaModule } from 'primeng/textarea';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

import { PlatformService } from '@admin/services/platforms/platform.service';
import { Platform } from '@admin/interfaces/platform';
import { Message } from 'primeng/message';
import { Button } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';
import { NgForOf, NgIf } from '@angular/common';
import { InputText } from 'primeng/inputtext';
import { ToggleButton } from 'primeng/togglebutton';

@Component({
    selector: 'app-platform',
    imports: [ReactiveFormsModule, TextareaModule, ToggleSwitchModule, Message, Button, Tooltip, NgIf, NgForOf, InputText, ToggleButton],
    templateUrl: './platform.component.html',
    styleUrl: './platform.component.scss',
    providers: [DialogService]
})
export class PlatformComponent {
    private formBuilder = inject(FormBuilder);
    private dialogRef = inject(DynamicDialogRef);
    private dialogConfig = inject(DynamicDialogConfig);
    private platformService: PlatformService = inject(PlatformService);

    dialogMode: 'create' | 'update' | 'delete' = 'create';
    httpLoading: boolean = false;
    selectedEntity!: Platform;
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
        this.platformService.create(request).subscribe({
            next: (data: any) => {
                this.entityForm.reset();
                this.httpLoading = false;
                this.dialogRef.close(data);
            },
            error: (error) => {
                this.httpLoading = false;
            }
        });
    }

    update(): void {
        this.httpLoading = true;
        let request = this.entityForm.value;
        this.selectedEntity.name = request.name;
        this.selectedEntity.description = request.description;
        this.selectedEntity.available = request.available;
        this.selectedEntity.icon = request.icon;
        this.platformService.update(this.selectedEntity).subscribe({
            next: (data: any) => {
                this.entityForm.reset();
                this.httpLoading = false;
                this.dialogRef.close(data);
            },
            error: (error) => {
                this.httpLoading = false;
            }
        });
    }

    delete(): void {
        this.httpLoading = true;
        this.platformService.delete(this.selectedEntity).subscribe({
            next: (data: any) => {
                this.entityForm.reset();
                this.httpLoading = false;
                this.dialogRef.close(data);
            },
            error: (error) => {
                this.httpLoading = false;
            }
        });
    }

    setIcon(icon: string): void {
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
            { value: 'pi pi-trophy' },
            { value: 'pi pi-microsoft' },
            { value: 'pi pi-android' },
            { value: 'pi pi-apple' },
            { value: 'pi pi-share-alt' },
            { value: 'pi pi-desktop' },
            { value: 'pi pi-asterisk' }
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
                    available: [false, [Validators.required]],
                    description: [null],
                    icon: [null, [Validators.required]]
                });
                break;
            case 'update':
            case 'delete':
                this.entityForm = this.formBuilder.group({
                    name: [this.selectedEntity.name, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
                    available: [this.selectedEntity.available, [Validators.required]],
                    description: [this.selectedEntity.description],
                    icon: [this.selectedEntity.icon, [Validators.required]]
                });
                break;
        }
    }
}
