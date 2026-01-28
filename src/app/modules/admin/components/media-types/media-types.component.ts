import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
import { MediaType} from '@admin/interfaces/media-type';
import { MediaTypesService } from '@admin/services/media-types/media-types.service';
import { MediaTypeComponent } from '@admin/components/media-types/media-type/media-type.component';

@Component({
    selector: 'app-media-types',
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
    templateUrl: './media-types.component.html',
    styleUrl: './media-types.component.scss',
    providers: [DialogService],
})
export class MediaTypesComponent {
    private dialogService: DialogService = inject(DialogService);
    private formBuilder: FormBuilder = inject(FormBuilder);
    private messageService: MessageService = inject(MessageService);
    private appStorageService: AppStorageService = inject(AppStorageService);
    private mediaTypesService:MediaTypesService = inject(MediaTypesService);
    private router: Router = inject(Router);

    ref!: DynamicDialogRef;
    permissions: string[] =[];
    loadingPage: boolean = true;
    meta!: Meta;
    mediaTypes: MediaType[] = [];
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
        this.fetchMediaTypes();
    }

    filterEntities(): void {
        this.filteredEntities = true;
        this.fetchMediaTypes();
    }

    showCreateEntity(): void {
        this.ref = this.dialogService.open(MediaTypeComponent, {
            header: 'Agreagar tipo de multimedia',
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
                    detail: 'Tipo de multimedia creado correctamente',
                    key: 'main'
                });
                this.fetchMediaTypes();
            }
        });
    }

    showUpdateEntity(entity:MediaType): void {
        this.ref = this.dialogService.open(MediaTypeComponent, {
            header: 'Editar tipo de multimedia',
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
                    detail: 'Tipo actualizao correctamente',
                    key: 'main'
                });
                this.fetchMediaTypes();
            }
        });
    }

    showDelete(entity:MediaType):void {
        this.ref = this.dialogService.open(MediaTypeComponent, {
            header: 'Eliminar tipo de multimedia',
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
                    detail: 'Tipo de multimedia eliminado',
                    key: 'main'
                });
                this.fetchMediaTypes();
            }
        });
    }

    fetchMediaTypes(event: any = null): void {
        if (event !== null) {
            this.entitiesFilter.page = event.first / event.rows;
        }

        if(this.filteredEntities){
            let filterForm = this.entitiesFilterForm.value;

            if(filterForm.text != null){
                this.entitiesFilter.text = filterForm.text;
            }
            if(filterForm.state != null){
                this.entitiesFilter.enabled = filterForm.state;
            }
        }

        this.loadingEntities = true;
        this.mediaTypesService.fetch(this.entitiesFilter).subscribe({
            next: (res: Envelop<MediaType>) => {
                this.mediaTypes = res.mediaTypes;
                this.meta = res.meta;
                this.loadingEntities = false;
            },
            complete: () => {
                this.loadingEntities = false;
            }
        });
    }

    manageEntityEvt(entity:MediaType): void {
        this.router.navigate(['admin/media-types', entity.typeId])
                    .then(r => {});
    }

    private loadInitialData(): void {
        this.mediaTypesService.fetch(this.entitiesFilter).subscribe({
            next: (res: Envelop<MediaType>) => {
                this.loadingPage = false;
                this.mediaTypes = res.mediaTypes;
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
