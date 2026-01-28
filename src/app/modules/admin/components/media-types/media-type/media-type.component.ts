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
import { MediaTypesService } from '@admin/services/media-types/media-types.service';
import { MediaType } from '@admin/interfaces/media-type';

@Component({
  selector: 'app-media-type',
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
  templateUrl: './media-type.component.html',
  styleUrl: './media-type.component.scss'
})
export class MediaTypeComponent {
    private formBuilder = inject(FormBuilder);
    private dialogRef = inject(DynamicDialogRef);
    private dialogConfig = inject(DynamicDialogConfig);
    private entityService: MediaTypesService = inject(MediaTypesService);

    dialogMode: 'create' | 'update' | 'delete' = 'create';
    httpLoading: boolean = false;
    selectedEntity!: MediaType;
    entityForm!: FormGroup;

    constructor(@Inject('DefaultTooltipOptions') public tooltipOption: TooltipOptions) {}

    ngOnInit() {
        this.dialogMode = this.dialogConfig.data.mode;
        if (this.dialogMode != 'create') {
            this.selectedEntity = this.dialogConfig.data.entity;
        }
        this.buildUserForm();
    }

    create(): void {
        this.httpLoading = true;
        let request = this.entityForm.value;
        this.entityService.create(request).subscribe({
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
        this.selectedEntity.enabled = request.enabled;
        this.entityService.update(this.selectedEntity).subscribe({
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

    delete():void{
        this.httpLoading = true;
        this.entityService.delete(this.selectedEntity).subscribe({
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

    exitModal(): void {
        this.dialogRef.close();
    }

    private buildUserForm(): void {
        switch (this.dialogMode) {
            case 'create':
                this.entityForm = this.formBuilder.group({
                    name: [null, [Validators.required, Validators.minLength(3)]],
                    enabled: [false, [Validators.required]],
                    description: ['',  [Validators.required]]
                });
                break;
            case 'update':
            case 'delete':
                this.entityForm = this.formBuilder.group({
                    name: [this.selectedEntity.name, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
                    enabled: [this.selectedEntity.enabled, [Validators.required]],
                    description: [this.selectedEntity.description, [Validators.required]]
                });
                break;
        }
    }
}
