import { Component, Inject, inject } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService, TooltipOptions } from 'primeng/api';
import { Meta } from '@shared/interfaces/meta';
import { Area } from '@admin/interfaces/area';
import { Filter } from '@shared/interfaces/filter';
import { Envelop } from '@shared/interfaces/envelop';
import { Button } from 'primeng/button';
import { DatatableSkeletonComponent } from '@shared/components/datatable-skeleton/datatable-skeleton.component';
import { DatePipe, NgIf } from '@angular/common';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { Tooltip } from 'primeng/tooltip';
import { Device } from '@admin/interfaces/device';
import { DeviceService } from '@admin/services/devices/device.service';
import { DeviceComponent } from '@admin/components/devices/device/device.component';
import { AppStorageService } from '@shared/services/app-storage/app-storage.service';

@Component({
    selector: 'app-devices',
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
    templateUrl: './devices.component.html',
    styleUrl: './devices.component.scss',
    providers:[DialogService]
})

export class DevicesComponent {
    private dialogService: DialogService = inject(DialogService);
    private formBuilder: FormBuilder = inject(FormBuilder);
    private messageService: MessageService = inject(MessageService);
    private deviceService: DeviceService = inject(DeviceService);
    private appStorageService: AppStorageService = inject(AppStorageService);

    ref!: DynamicDialogRef;
    loadingPage: boolean = true;
    permissions: string[] =[];
    meta!: Meta;
    devices: Device[] = [];
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
        this.permissions = this.appStorageService.getPermissions().filter(x=>x.includes('device'));
    }

    clearFilters(): void {
        this.entitiesFilter = new Filter();
        this.entitiesFilterForm.reset();
        this.filteredEntities = false;
        this.fetchDevices();
    }

    filterEntities(): void {
        this.filteredEntities = true;
        this.fetchDevices();
    }

    showCreateEntity(): void {
        this.ref = this.dialogService.open(DeviceComponent, {
            header: 'Agregar dispositivo',
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
                    detail: 'Dispositivo creado correctamente',
                    key: 'main'
                });
                this.fetchDevices();
            }
        });
    }

    showUpdateEntity(entity: Device): void {
        this.ref = this.dialogService.open(DeviceComponent, {
            header: 'Actualizar dispositivo',
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
                    detail: 'Dispositvo actualizao correctamente',
                    key: 'main'
                });
                this.fetchDevices();
            }
        });
    }

    showDelete(area: Area): void {
        this.ref = this.dialogService.open(DeviceComponent, {
            header: 'Eliminar curso',
            data: {
                mode: 'delete',
                entity: area
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
                    detail: 'Curso eliminado correctamente',
                    key: 'main'
                });
                this.fetchDevices();
            }
        });
    }

    fetchDevices(event: any = null): void {
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
        this.deviceService.fetch(this.entitiesFilter).subscribe({
            next: (res: Envelop<Device>) => {
                this.devices = res.devices;
                this.meta = res.meta;
                this.loadingEntities = false;
            },
            complete: () => {
                this.loadingEntities = false;
            }
        });
    }

    private loadInitialData(): void {
        this.deviceService.fetch(this.entitiesFilter).subscribe({
            next: (res: Envelop<Device>) => {
                this.loadingPage = false;
                this.devices = res.devices;
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
