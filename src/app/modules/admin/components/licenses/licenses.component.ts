import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { DatePipe, NgIf } from '@angular/common';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { Tooltip } from 'primeng/tooltip';
import { Tag } from 'primeng/tag';
import { DatatableSkeletonComponent } from '@shared/components/datatable-skeleton/datatable-skeleton.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService, TooltipOptions } from 'primeng/api';
import { Meta } from '@shared/interfaces/meta';
import { Filter } from '@shared/interfaces/filter';
import { Envelop } from '@shared/interfaces/envelop';

import { AppStorageService} from '@shared/services/app-storage/app-storage.service';
import { LicensesService } from '@admin/services/licenses/licences.service';
import { License } from '@admin/interfaces/license';
import { LicenseComponent } from '@admin/components/licenses/license/license.component';

@Component({
  selector: 'app-licenses',
  imports: [
      Button,
      DatatableSkeletonComponent,
      DatePipe,
      IconField,
      InputIcon,
      InputText,
      NgIf,
      ReactiveFormsModule,
      Select,
      TableModule,
      Tooltip,
      ToggleButtonModule,
      Tag
  ],
  templateUrl: './licenses.component.html',
  styleUrl: './licenses.component.scss',
    providers: [DialogService],
})
export class LicensesComponent {
    private dialogService: DialogService = inject(DialogService);
    private formBuilder: FormBuilder = inject(FormBuilder);
    private messageService: MessageService = inject(MessageService);
    private licensesService:LicensesService = inject(LicensesService);
    private appStorageService: AppStorageService = inject(AppStorageService);

    ref!: DynamicDialogRef;
    permissions: string[] =[];
    loadingPage: boolean = true;
    meta!: Meta;
    licenses: License[] = [];
    loadingEntities: boolean = false;
    entitiesFilter: Filter = new Filter();
    filteredEntities:boolean = false;
    entitiesFilterForm!: FormGroup;
    activeOptions:any=[
        {
            name:"Activo",
            value:true,
        },
        {
            name:"Inactivo",
            value:false,
        }
    ];

    constructor(@Inject('DefaultTooltipOptions') public tooltipOption: TooltipOptions) {}

    ngOnInit() {
        this.loadInitialData();
        this.permissions = this.appStorageService.getPermissions().filter(x=>x.includes('area'));
        this.buildEntitiesFilterForm();
    }

    clearFilters(): void {
        this.entitiesFilter = new Filter();
        this.entitiesFilterForm.reset();
        this.filteredEntities = false;
        this.fetchLicenses();
    }

    filterEntities(): void {
        this.filteredEntities = true;
        this.fetchLicenses();
    }

    showCreateEntity(): void {
        this.ref = this.dialogService.open(LicenseComponent, {
            header: 'Agreagar licencia',
            data: {
                mode: 'create',
                entity: null
            },
            breakpoints:{
                '1200px': '30vw',
                '900px': '60vw',
                '600px': '90vw'
            },
            width:'30vw',
            modal: true,
            closable: true
        });

        this.ref.onClose.subscribe((result: any) => {
            if (result) {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Exito',
                    detail: 'Licencia creado correctamente',
                    key: 'main'
                });
                this.fetchLicenses();
            }
        });
    }

    showUpdateEntity(entity:License): void {
        this.ref = this.dialogService.open(LicenseComponent, {
            header: 'Editar Licencia',
            data: {
                mode: 'update',
                entity: entity
            },
            breakpoints: {
                '960px': '75vw',
                '640px': '90vw'
            },
            width:'30vw',
            modal: true,
            closable: true
        });

        this.ref.onClose.subscribe((result: any) => {
            if (result) {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Exito',
                    detail: 'Licencia actualizao correctamente',
                    key: 'main'
                });
                this.fetchLicenses();
            }
        });
    }

    showDelete(entity:License):void {
        this.ref = this.dialogService.open(LicenseComponent, {
            header: 'Eliminar licencia',
            data: {
                mode: 'delete',
                entity: entity
            },
            breakpoints: {
                '960px': '75vw',
                '640px': '90vw'
            },
            width:'30vw',
            modal: true,
            closable: true
        });

        this.ref.onClose.subscribe((result: any) => {
            if (result) {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Exito',
                    detail: 'Licencia eliminado',
                    key: 'main'
                });
                this.fetchLicenses();
            }
        });
    }

    fetchLicenses(event: any = null): void {
        if (event !== null) {
            this.entitiesFilter.page = event.first / event.rows;
        }

        if(this.filteredEntities){
            let filterForm = this.entitiesFilterForm.value;

            if(filterForm.text != null){
                this.entitiesFilter.text = filterForm.text;
            }
            if(filterForm.state != null){
                this.entitiesFilter.state = filterForm.state;
            }
        }

        this.loadingEntities = true;
        this.licensesService.fetch(this.entitiesFilter).subscribe({
            next: (res: Envelop<License>) => {
                this.licenses = res.licenses;
                this.meta = res.meta;
                this.loadingEntities = false;
            },
            complete: () => {
                this.loadingEntities = false;
            }
        });
    }

    private loadInitialData(): void {
        this.licensesService.fetch(this.entitiesFilter).subscribe({
            next: (res: Envelop<License>) => {
                this.loadingPage = false;
                this.licenses = res.licenses;
                this.meta = res.meta;
            }
        })

    }

    private buildEntitiesFilterForm(): void {
        this.entitiesFilterForm = this.formBuilder.group({
            text: [null],
            state: [null]
        });
    }
}
