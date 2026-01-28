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

import { DatatableSkeletonComponent } from '@shared/components/datatable-skeleton/datatable-skeleton.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService, TooltipOptions } from 'primeng/api';
import { Meta } from '@shared/interfaces/meta';
import { Filter } from '@shared/interfaces/filter';
import { Envelop } from '@shared/interfaces/envelop';
import { Area } from '@admin/interfaces/area';
import { AreasService } from '@admin/services/areas/areas.service';
import { SubjectComponent } from '@admin/components/subjects/subject/subject.component';
import { Tag } from 'primeng/tag';
import { AppStorageService} from '@shared/services/app-storage/app-storage.service';

@Component({
      selector: 'app-subjects',
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
    templateUrl: './subjects.component.html',
    styleUrl: './subjects.component.scss',
    providers: [DialogService],
})

export class SubjectsComponent {
    private dialogService: DialogService = inject(DialogService);
    private formBuilder: FormBuilder = inject(FormBuilder);
    private messageService: MessageService = inject(MessageService);
    private areaService:AreasService = inject(AreasService);
    private appStorageService: AppStorageService = inject(AppStorageService);

    ref!: DynamicDialogRef;
    permissions: string[] =[];
    loadingPage: boolean = true;

    meta!: Meta;
    areas: Area[] = [];
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
        this.fetchAreas();
    }

    filterEntities(): void {
        this.filteredEntities = true;
        this.fetchAreas();
    }

    showCreateEntity(): void {
        this.ref = this.dialogService.open(SubjectComponent, {
            header: 'Nuevo curso',
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
                    detail: 'Curso creado correctamente',
                    key: 'main'
                });
                this.fetchAreas();
            }
        });
    }

    showUpdateEntity(area:Area): void {
        this.ref = this.dialogService.open(SubjectComponent, {
            header: 'Editar curso',
            data: {
                mode: 'update',
                entity: area
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
                    detail: 'Curso actualizao correctamente',
                    key: 'main'
                });
                this.fetchAreas();
            }
        });
    }

    showDelete(area:Area):void {
        this.ref = this.dialogService.open(SubjectComponent, {
            header: 'Eliminar curso',
            data: {
                mode: 'delete',
                entity: area
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
                    detail: 'Curso eliminado correctamente',
                    key: 'main'
                });
                this.fetchAreas();
            }
        });
    }

    fetchAreas(event: any = null): void {
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
        this.areaService.fetch(this.entitiesFilter).subscribe({
            next: (res: Envelop<Area>) => {
                this.areas = res.areas;
                this.meta = res.meta;
                this.loadingEntities = false;
            },
            complete: () => {
                this.loadingEntities = false;
            }
        });
    }

    private loadInitialData(): void {
        this.areaService.fetch(this.entitiesFilter).subscribe({
            next: (res: Envelop<Area>) => {
                this.loadingPage = false;
                this.areas = res.areas;
                this.meta = res.meta;
            }
        })

    }

    private buildEntitiesFilterForm(): void {
        this.entitiesFilterForm = this.formBuilder.group({
            text: [null],
            state: [null],
            area: [null]
        });
    }

}
