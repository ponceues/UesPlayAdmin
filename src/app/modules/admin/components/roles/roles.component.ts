import { Component, inject, Inject, OnInit } from '@angular/core';
import { DatePipe, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { TooltipOptions,MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { RolesService } from '../../services/roles/roles.service';
import { Filter } from '../../../shared/interfaces/filter';
import { Rol } from '../../interfaces/rol';
import { Envelop } from '../../../shared/interfaces/envelop';
import { Meta } from '../../../shared/interfaces/meta';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RolComponent } from './rol/rol.component';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-roles',
    imports: [TableModule, DatePipe, TagModule, NgIf, DynamicDialogModule, ButtonModule, ChipModule, TooltipModule, InputTextModule, SelectModule, MultiSelectModule, FormsModule, IconField, InputIcon, ReactiveFormsModule, RouterLink],
    templateUrl: './roles.component.html',
    styleUrl: './roles.component.scss',
    providers: [RolesService, DialogService]
})
export class RolesComponent implements OnInit {
    private router = inject(Router);
    private formBuilder = inject(FormBuilder);
    ref: DynamicDialogRef | undefined;
    rolStatus: any[] = [];
    roles: Rol[] = [];
    meta: Meta = { count: 0, page: 0, pageSize: 10, key:'roles' };
    rolesFilter!: Filter;
    filterForm!: FormGroup;
    loadingTable: boolean = false;
    filteredTable: boolean = false;
    availableFiltered: boolean = false;

    constructor(
        @Inject('DefaultTooltipOptions') public tooltipOption: TooltipOptions,
        private messageService: MessageService,
        public dialogService: DialogService,
        private rolService: RolesService
    ) {
        this.rolesFilter = new Filter();
        this.buildFilterForm();
        this.loadRolStatus();
    }

    ngOnInit() {
        this.fetchRoles();
    }

    clearFilters(): void {
        this.rolesFilter = new Filter();
        this.filteredTable = false;
        this.availableFiltered = false;
        this.filterForm.reset();
        this.fetchRoles();
    }

    fetchRoles(event: any = null): void {
        if (event !== null) {
            this.rolesFilter.page = event.first / event.rows;
        }
        this.loadingTable = true;
        this.rolService.fetch(this.rolesFilter).subscribe({
            next: (res: Envelop<Rol>) => {
                this.roles = res.roles;
                this.meta = res.meta;
            },
            complete: () => {
                this.loadingTable = false;
            }
        });
    }

    filterTable(): void {
        this.filteredTable = true;
        let formValue = this.filterForm.value;
        if (formValue.available != null) {
            this.rolesFilter.available = formValue.available;
        }
        this.fetchRoles();
    }

    buildFilterForm(): void {
        this.filterForm = this.formBuilder.group({
            available: [null],
            text: [null]
        });

        this.filterForm.valueChanges.subscribe((value) => {
            this.availableFiltered = true;
        });
    }

    loadRolStatus(): void {
        this.rolStatus = [
            { icon: 'pi pi-check', label: 'Activo', value: true, severity: 'success' },
            { icon: 'pi pi-times', label: 'Inactivo', value: false, severity: 'danger' }
        ];
    }

    showCreateRolModal(): void {
        this.ref = this.dialogService.open(RolComponent, {
            header: 'Nuevo rol',
            data: {
                mode: 'create',
                rolId: null
            },
            width: '25vw',
            modal: true,
            closable: true,
            breakpoints: {
                '960px': '50vw',
                '640px': '90vw'
            }
        });

        this.ref.onClose.subscribe((createdRol: Rol) => {
            if (createdRol) {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Rol creado con exito',
                    detail: 'El rol se creó correctamente',
                    key: 'main'
                });
                this.fetchRoles();
            }
        });
    }

    showUpdateModal(entity: Rol): void {
        this.ref = this.dialogService.open(RolComponent, {
            header: 'Actualizar rol',
            data: {
                mode: 'update',
                entity: entity
            },
            width: '25vw',
            modal: true,
            closable: true,
            breakpoints: {
                '960px': '50vw',
                '640px': '90vw'
            }
        });

        this.ref.onClose.subscribe((result: boolean) => {
            if (result) {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Exito',
                    detail: 'Actualización exitosa',
                    key: 'main'
                });
                this.fetchRoles();
            }
        });
    }

    showDeleteModal(entity: Rol): void {
        this.ref = this.dialogService.open(RolComponent, {
            header: 'Elimar rol',
            data: {
                mode: 'delete',
                entity: entity
            },
            width: '25vw',
            modal: true,
            closable: true,
            breakpoints: {
                '960px': '50vw',
                '640px': '90vw'
            }
        });

        this.ref.onClose.subscribe((result: boolean) => {
            if (result) {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Exito',
                    detail: 'Solicitud completada exitosamente',
                    key: 'main'
                });
                this.fetchRoles();
            }
        });
    }

    private loadInitialData(): void {}
}
