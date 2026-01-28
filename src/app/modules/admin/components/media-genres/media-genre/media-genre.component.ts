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
import { MediaGenre } from '@admin/interfaces/media-genre';
import { MediaGenreService } from '@admin/services/media-genre/media-genre.service';

@Component({
  selector: 'app-media-genre',
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
  templateUrl: './media-genre.component.html',
  styleUrl: './media-genre.component.scss'
})
export class MediaGenreComponent {
    private formBuilder = inject(FormBuilder);
    private dialogRef = inject(DynamicDialogRef);
    private dialogConfig = inject(DynamicDialogConfig);
    private entityService: MediaGenreService = inject(MediaGenreService);

    dialogMode: 'create' | 'update' | 'delete' = 'create';
    httpLoading: boolean = false;
    selectedEntity!: MediaGenre;
    mediaTypeId: string = '';
    entityForm!: FormGroup;

    constructor(@Inject('DefaultTooltipOptions') public tooltipOption: TooltipOptions) {}

    ngOnInit() {
        this.dialogMode = this.dialogConfig.data.mode;
        this.mediaTypeId = this.dialogConfig.data.typeId;

        if (this.dialogMode != 'create') {
            this.selectedEntity = this.dialogConfig.data.entity;
        }
        this.buildUserForm();
    }

    create(): void {
        this.httpLoading = true;
        let request = this.entityForm.value;
        this.entityService.create(request, this.mediaTypeId).subscribe({
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
        this.entityService.update(this.selectedEntity, this.mediaTypeId).subscribe({
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
        this.entityService.delete(this.selectedEntity, this.mediaTypeId).subscribe({
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
                    mediaTypeId:[this.mediaTypeId,[Validators.required]],
                    enabled: [false, [Validators.required]],
                    description: ['',  [Validators.required]]
                });
                break;
            case 'update':
            case 'delete':
                this.entityForm = this.formBuilder.group({
                    name: [this.selectedEntity.name, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
                    mediaTypeId:[this.mediaTypeId,[Validators.required]],
                    enabled: [this.selectedEntity.enabled, [Validators.required]],
                    description: [this.selectedEntity.description, [Validators.required]]
                });
                break;
        }
    }
}
