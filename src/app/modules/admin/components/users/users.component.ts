import { Component, Inject, inject } from '@angular/core';
import { DatePipe, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {forkJoin, Observable } from 'rxjs';

import { Button } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { Tooltip } from 'primeng/tooltip';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService, TooltipOptions } from 'primeng/api';

import { Filter } from '@shared/interfaces/filter';
import { Envelop } from '@shared/interfaces/envelop';
import { UsersService } from '@admin/services/users/users.service';
import { UserStateService} from '@admin/services/user-state/user-state.service';
import { UserState} from '@admin/interfaces/user-state';

import { Meta } from '@shared/interfaces/meta';
import { User } from '@admin/interfaces/user';
import { DatatableSkeletonComponent } from '@shared/components/datatable-skeleton/datatable-skeleton.component';
import { UserStatesEnum } from '@admin/enums/user-states-enum';
import { UserComponent } from '@admin/components/users/user/user.component';
import { BulkLoadComponent } from '@admin/components/users/bulk-load/bulk-load.component';
import { AppStorageService } from '@shared/services/app-storage/app-storage.service';


@Component({
    selector: 'app-users',
    imports: [DatePipe, FormsModule, NgIf, ReactiveFormsModule, TableModule, Tag, DatatableSkeletonComponent, IconField, InputIcon, Select, Button, Tooltip, InputText],
    templateUrl: './users.component.html',
    styleUrl: './users.component.scss',
    providers: [DialogService]
})
export class UsersComponent {
    private userStateService: UserStateService = inject(UserStateService);
    private dialogService: DialogService = inject(DialogService);
    private userService: UsersService = inject(UsersService);
    private formBuilder: FormBuilder = inject(FormBuilder);
    private messageService: MessageService = inject(MessageService);
    private appStorageService: AppStorageService = inject(AppStorageService);

    ref!: DynamicDialogRef;
    loadingPage: boolean = true;
    permissions: string[] = [];
    meta!: Meta;
    loadingEntities: boolean = false;
    entitiesFilter: Filter = new Filter();
    entities: User[] = [];
    filteredEntities:boolean = false;
    entitiesFilterForm!: FormGroup;

    userStates: UserState[] = [];
    userStatesEnum = UserStatesEnum;

    constructor(@Inject('DefaultTooltipOptions') public tooltipOption: TooltipOptions) {}

    ngOnInit() {
        this.loadInitialData();
        this.buildEntitiesFilterForm();
        this.loadPermissions();

    }

    clearFilters(): void {
        this.entitiesFilter = new Filter();
        this.entitiesFilterForm.reset();
        this.filteredEntities = false;
        this.fetchUsers();
    }

    filterEntities(): void {
        this.filteredEntities = true;
        this.fetchUsers();
    }

    showCreateEntity(): void {
        this.ref = this.dialogService.open(UserComponent, {
            header: 'Nuevo usuario',
            data: {
                mode: 'create',
                rolId: null
            },
            width: '30rem',
            modal: true,
            closable: true,
            breakpoints: {
                '640px': '90vw'
            }
        });

        this.ref.onClose.subscribe((result: any) => {
            if (result) {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Exito',
                    detail: 'El usuario creó correctamente',
                    key: 'main'
                });
                this.fetchUsers();
            }
        });
    }

    showUpdateEntity(user:User): void {
        this.ref = this.dialogService.open(UserComponent, {
            header: 'Actualizar usuario',
            data: {
                mode: 'update',
                entity:user
            },
            width: '30rem',
            modal: true,
            closable: true,
            breakpoints: {
                '640px': '90vw'
            }
        });

        this.ref.onClose.subscribe((result: any) => {
            if (result) {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Exito',
                    detail: 'El usuario actualizado correctamente',
                    key: 'main'
                });
                this.fetchUsers();
            }
        });
    }

    showBulkUpload():void{
        this.ref = this.dialogService.open(BulkLoadComponent, {
            header: 'Carga masiva',
            width: '40vw',
            modal: true,
            closable: true
        });

        this.ref.onClose.subscribe((result: any) => {
            if (result) {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Exito',
                    detail: 'Se ha completado la carga masiva de usuarios',
                    key: 'main'
                });
                this.fetchUsers();
            }
        });
    }

    fetchUsers(event: any = null): void {
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
            if(filterForm.area != null){
                this.entitiesFilter.areaId = filterForm.area;
            }

        }

        this.loadingEntities = true;
        this.userService.fetch(this.entitiesFilter).subscribe({
            next: (res: Envelop<User>) => {
                this.entities = res.users;
                this.meta = res.meta;
                this.loadingEntities = false;
            },
            complete: () => {
                this.loadingEntities = false;
            }
        });
    }

    private loadPermissions(): void {
        this.permissions = this.appStorageService.getPermissions().filter(x=>x.includes('users'));
    }

    private loadInitialData(): void {
        const statesFilter: Filter = new Filter();
        statesFilter.pageSize = 1000;

        const usersRequest = this.userService.fetch(this.entitiesFilter);
        const statesRequest: Observable<Envelop<UserState>> = this.userStateService.fetch(statesFilter);
        forkJoin([usersRequest, statesRequest]).subscribe({
            next: ([userResult, statesResult]) => {
                this.meta = userResult.meta;
                this.entities = userResult.users;

                this.userStates = statesResult.states;
                this.loadingPage = false;
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
