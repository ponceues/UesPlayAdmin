import { Component, inject, Inject } from '@angular/core';
import {forkJoin, Observable } from 'rxjs';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { Filter } from '@shared/interfaces/filter';
import { TooltipOptions } from 'primeng/api';
import { Envelop } from '@shared/interfaces/envelop';
import { AreasService } from '@admin/services/areas/areas.service';
import { RolesService } from '@admin/services/roles/roles.service';
import { Area } from '@admin/interfaces/area';
import { Rol } from '@admin/interfaces/rol';
import { Button } from 'primeng/button';
import { Message } from 'primeng/message';
import { NgIf } from '@angular/common';
import { Select } from 'primeng/select';
import { Tooltip } from 'primeng/tooltip';
import { FileUploadModule } from 'primeng/fileupload';
import { UsersService } from '@admin/services/users/users.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-bulk-load',
  imports: [
      Button,
      Message,
      NgIf,
      ReactiveFormsModule,
      Select,
      Tooltip,
      FileUploadModule
  ],
  templateUrl: './bulk-load.component.html',
  styleUrl: './bulk-load.component.scss'
})

export class BulkLoadComponent {
    private rolService:RolesService = inject(RolesService);
    private areaService:AreasService = inject(AreasService);
    private userService:UsersService = inject(UsersService);
    private formBuilder: FormBuilder = inject(FormBuilder);
    private dialogRef = inject(DynamicDialogRef);

    roles:Rol[]=[];
    areas:Area[]=[];
    bulkForm!: FormGroup;
    httpLoading:boolean = false;

    constructor(@Inject('DefaultTooltipOptions') public tooltipOption: TooltipOptions) {}

    ngOnInit() {
        this.buildComponent();
        this.buildForm();
    }

    private buildForm(){
        this.bulkForm = this.formBuilder.group({
            rolId: [null, [Validators.required]],
            areaId: [null, [Validators.required]],
            file: [null, [Validators.required]]
        });
    }

    exitModal():void{
        this.dialogRef.close();
    }

    bulkCreate():void{

        let formValue = this.bulkForm.value;
        this.httpLoading = true;
        this.userService.uploadBulk(formValue.areaId,formValue.rolId,formValue.file).subscribe({
            next: (result:any) => {
                this.dialogRef.close(true);
            }
        })
    }

    dowloadTemaplate():void{
        this.userService.downloadTemplate().subscribe({
            next: blob => {
                const a = document.createElement('a');
                const objectUrl = URL.createObjectURL(blob);
                a.href = objectUrl;
                a.download = 'PlantillaUsusarios.xlsx';
                a.click();
                URL.revokeObjectURL(objectUrl);
            },
            error: err => {
                console.log(err);
            }
        })
    }

    onSelectFile(event:any):void{
        const file = event.files[0];
        this.bulkForm.get('file')?.setValue(file);
    }

    onClearFile():void{
        this.bulkForm.get('file')?.setValue(null);
    }

    private buildComponent(){
        const filter: Filter = new Filter();
        filter.pageSize = 1000;

        const rolRequest:Observable<Envelop<Rol>> = this.rolService.fetch(filter) ;
        const areaRequest: Observable<Envelop<Area>> = this.areaService.fetch(filter);
        forkJoin([rolRequest, areaRequest]).subscribe({
            next: ([rolResult, areaResult]) => {
                this.areas = areaResult.areas;
                this.roles = rolResult.roles;
            }
        });
    }

}
