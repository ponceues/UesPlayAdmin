import { Component, Inject, inject } from '@angular/core';
import { Button } from 'primeng/button';
import { DatatableSkeletonComponent } from '@shared/components/datatable-skeleton/datatable-skeleton.component';
import { DatePipe, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { Tooltip } from 'primeng/tooltip';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService, TooltipOptions } from 'primeng/api';
import { Meta } from '@shared/interfaces/meta';
import { Filter } from '@shared/interfaces/filter';
import { Envelop } from '@shared/interfaces/envelop';
import { DeviceService } from '@admin/services/devices/device.service';
import { PlatformService } from '@admin/services/platforms/platform.service';
import { Platform } from '@admin/interfaces/platform';
import { PlatformComponent } from '@admin/components/platforms/platform/platform.component';
import { AppStorageService} from '@shared/services/app-storage/app-storage.service';


@Component({
    selector: 'app-platforms',
    imports: [
        Button,
        DatatableSkeletonComponent,
        DatePipe,
        FormsModule,
        IconField,
        InputIcon,
        InputText,
        NgIf,
        ReactiveFormsModule,
        Select,
        TableModule,
        Tag,
        Tooltip
      ],
    templateUrl: './platforms.component.html',
    styleUrl: './platforms.component.scss',
    providers: [DialogService],
})
export class PlatformsComponent {
    private dialogService: DialogService = inject(DialogService);
    private formBuilder: FormBuilder = inject(FormBuilder);
    private messageService: MessageService = inject(MessageService);
    private platformService: PlatformService = inject(PlatformService);
    private appStorageService: AppStorageService = inject(AppStorageService);

    ref!: DynamicDialogRef;
    loadingPage: boolean = true;
    permissions: string[] = [];
    meta!: Meta;
    platforms: Platform[] = [];
    loadingEntities: boolean = false;
    entitiesFilter: Filter = new Filter();
    filteredEntities: boolean = false;
    entitiesFilterForm!: FormGroup;
    activeOptions: any = [
        {
            name: 'Activo',
            value: true
        },
        {
            name: 'Inactivo',
            value: false
        }
    ];

    constructor(@Inject('DefaultTooltipOptions') public tooltipOption: TooltipOptions) {}

    ngOnInit() {
        this.loadInitialData();
        this.buildEntitiesFilterForm();
        this.permissions = this.appStorageService.getPermissions().filter(x=>x.includes('platform'));
    }

    clearFilters(): void {
        this.entitiesFilter = new Filter();
        this.entitiesFilterForm.reset();
        this.filteredEntities = false;
        this.fetchPlatforms();
    }

    filterEntities(): void {
        this.filteredEntities = true;
        this.fetchPlatforms();
    }

    showCreateEntity(): void {
        this.ref = this.dialogService.open(PlatformComponent, {
            header: 'Agregar plataforma',
            data: {
                mode: 'create',
                entity: null
            },
            breakpoints: {
                '1200px': '30vw',
                '900px': '60vw',
                '600px': '90vw'
            },
            width: '30vw',
            modal: true,
            closable: true
        });

        this.ref.onClose.subscribe((result: any) => {
            if (result) {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Exito',
                    detail: 'Plataforma creado correctamente',
                    key: 'main'
                });
                this.fetchPlatforms();
            }
        });
    }

    showUpdateEntity(entity: Platform): void {
        this.ref = this.dialogService.open(PlatformComponent, {
            header: 'Actualizar plataforma',
            data: {
                mode: 'update',
                entity: entity
            },
            breakpoints: {
                '960px': '75vw',
                '640px': '90vw'
            },
            width: '30vw',
            modal: true,
            closable: true
        });

        this.ref.onClose.subscribe((result: any) => {
            if (result) {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Exito',
                    detail: 'Plataforma actualizada correctamente',
                    key: 'main'
                });
                this.fetchPlatforms();
            }
        });
    }

    showDelete(entity: Platform): void {
        this.ref = this.dialogService.open(PlatformComponent, {
            header: 'Eliminar plataforma',
            data: {
                mode: 'delete',
                entity: entity
            },
            breakpoints: {
                '960px': '75vw',
                '640px': '90vw'
            },
            width: '30vw',
            modal: true,
            closable: true
        });

        this.ref.onClose.subscribe((result: any) => {
            if (result) {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Exito',
                    detail: 'Plataforma eliminada correctamente',
                    key: 'main'
                });
                this.fetchPlatforms();
            }
        });
    }

    fetchPlatforms(event: any = null): void {
        if (event !== null) {
            this.entitiesFilter.page = event.first / event.rows;
        }

        if (this.filteredEntities) {
            let filterForm = this.entitiesFilterForm.value;

            if (filterForm.text != null) {
                this.entitiesFilter.text = filterForm.text;
            }
            if (filterForm.state != null) {
                this.entitiesFilter.state = filterForm.state;
            }
        }

        this.loadingEntities = true;
        this.platformService.fetch(this.entitiesFilter).subscribe({
            next: (res: Envelop<Platform>) => {
                this.platforms = res.platforms;
                this.meta = res.meta;
                this.loadingEntities = false;
            },
            complete: () => {
                this.loadingEntities = false;
            }
        });
    }

    private loadInitialData(): void {
        this.platformService.fetch(this.entitiesFilter).subscribe({
            next: (res: Envelop<Platform>) => {
                this.loadingPage = false;
                this.platforms = res.platforms;
                this.meta = res.meta;
            }
        });
    }

    private buildEntitiesFilterForm(): void {
        this.entitiesFilterForm = this.formBuilder.group({
            text: [null],
            state: [null],
            area: [null]
        });
    }
}
