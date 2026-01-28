import { Component, Inject, inject } from '@angular/core';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { Tooltip } from 'primeng/tooltip';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Area } from '@admin/interfaces/area';
import { TooltipOptions } from 'primeng/api';
import { AreasService } from '@admin/services/areas/areas.service';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ToggleButton } from 'primeng/togglebutton';


@Component({
    selector: 'app-subject',
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
    templateUrl: './subject.component.html',
    styleUrl: './subject.component.scss'
})
export class SubjectComponent {
    private formBuilder = inject(FormBuilder);
    private dialogRef = inject(DynamicDialogRef);
    private dialogConfig = inject(DynamicDialogConfig);
    private areaService: AreasService = inject(AreasService);

    dialogMode: 'create' | 'update' | 'delete' = 'create';
    httpLoading: boolean = false;
    selectedArea!: Area;
    areaForm!: FormGroup;

    constructor(@Inject('DefaultTooltipOptions') public tooltipOption: TooltipOptions) {}

    ngOnInit() {
        this.dialogMode = this.dialogConfig.data.mode;

        if (this.dialogMode != 'create') {
            this.selectedArea = this.dialogConfig.data.entity;
        }
        this.buildUserForm();
    }

    create(): void {
        this.httpLoading = true;
        let request = this.areaForm.value;
        this.areaService.create(request).subscribe({
            next: (data: any) => {
                this.areaForm.reset();
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
        let request = this.areaForm.value;
        this.selectedArea.name = request.name;
        this.selectedArea.description = request.description;
        this.selectedArea.active = request.active;
        this.areaService.update(this.selectedArea).subscribe({
            next: (data: any) => {
                this.areaForm.reset();
                this.httpLoading = false;
                this.dialogRef.close(data);
            },
            error: error => {
                this.httpLoading = false;
            }
        });
    }

    delete():void{
        this.httpLoading = true;
        this.areaService.delete(this.selectedArea).subscribe({
            next: (data: any) => {
                this.areaForm.reset();
                this.httpLoading = false;
                this.dialogRef.close(data);
            },
            error: error => {
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
                this.areaForm = this.formBuilder.group({
                    code: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(255)]],
                    name: [null, [Validators.required, Validators.minLength(6)]],
                    active: [false, [Validators.required]],
                    description: [null ]
                });
                break;
            case 'update':
            case 'delete':
                this.areaForm = this.formBuilder.group({
                    name: [this.selectedArea.name, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
                    code: [this.selectedArea.code, [Validators.required, Validators.minLength(3)]],
                    active: [this.selectedArea.active, [Validators.required]],
                    description: [this.selectedArea.description]
                });
                break;
        }
    }
}
