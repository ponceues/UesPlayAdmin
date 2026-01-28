import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TooltipOptions } from 'primeng/api';
import { forkJoin } from 'rxjs';

import { UsersService } from '@admin/services/users/users.service';
import { RolesService } from '@admin/services/roles/roles.service';
import { UserStateService } from '@admin/services/user-state/user-state.service';
import { Filter } from '@shared/interfaces/filter';
import { UserState } from '@admin/interfaces/user-state';
import { Rol } from '@admin/interfaces/rol'
import { InputText } from 'primeng/inputtext';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { Select } from 'primeng/select';
import { Area } from '@admin/interfaces/area';
import { Button } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';

import { Message } from 'primeng/message';
import { NgIf } from '@angular/common';
import { User } from '@admin/interfaces/user';
import { AppStorageService } from '@shared/services/app-storage/app-storage.service';
import { AreasService } from '@admin/services/areas/areas.service';
import { MultiSelect } from 'primeng/multiselect';


@Component({
    selector: 'app-user',
    imports: [ReactiveFormsModule, InputText, IconField, InputIcon, Select, Button, Tooltip, Message, NgIf, MultiSelect],
    templateUrl: './user.component.html',
    styleUrl: './user.component.scss'
})
export class UserComponent {
    private formBuilder = inject(FormBuilder);
    private dialogRef = inject(DynamicDialogRef);
    private dialogConfig = inject(DynamicDialogConfig);
    private userService: UsersService = inject(UsersService);
    private rolService: RolesService = inject(RolesService);
    private userStateService: UserStateService = inject(UserStateService);
    private appStorageService: AppStorageService = inject(AppStorageService);
    private areasService = inject(AreasService);

    httpLoading: boolean = false;
    selectedUser!: User;
    userForm!: FormGroup;
    userStates: UserState[] = [];
    roles: Rol[] = [];
    areas: Area[] = [];
    permissions: string[] = [];

    dialogMode: 'create' | 'update' | 'delete' = 'create';

    constructor(@Inject('DefaultTooltipOptions') public tooltipOption: TooltipOptions) {}

    ngOnInit() {
        this.getDataComponent();
        this.dialogMode = this.dialogConfig.data.mode;

        if (this.dialogMode != 'create') {
            this.selectedUser = this.dialogConfig.data.entity;
        }
        this.buildUserForm();
        this.permissions = this.appStorageService.getPermissions().filter((x) => x.includes('users'));
            if (this.permissions.includes('can.assign.users.areas')) {
            this.fetchAreas();
        } else {
            this.recoverAreas();
        }
    }

    createUser(): void {
        this.httpLoading = true;
        let request = this.userForm.value;
        this.userService.create(request).subscribe({
            next: (data: any) => {
                this.userForm.reset();
                this.httpLoading = false;
                this.dialogRef.close(data);
            },
            error: (error) => {
                this.httpLoading = false;
            }
        });
    }

    updateUser(): void {
        this.httpLoading = true;
        let request = this.userForm.value;
        this.selectedUser.name = request.name;
        this.selectedUser.stateId = request.stateId;
        this.selectedUser.rolId = request.rolId;
        this.selectedUser.areasCodes = request.areasCodes;
        // ensure areas are updated on the selectedUser if applicable
        if (request.areaIds) {
            // assign array of ids (keep existing property name on the server model)
            (this.selectedUser as any).areaIds = request.areaIds;
        }
        this.userService.update(this.selectedUser).subscribe({
            next: (data: any) => {
                this.userForm.reset();
                this.httpLoading = false;
                this.dialogRef.close(data);
            },
            error: (error) => {
                this.httpLoading = false;
            }
        });
    }

    exitModal(): void {
        this.dialogRef.close();
    }

    private recoverAreas(): void {
        let areasStr = localStorage.getItem('areas');
        if (areasStr) {
            this.areas = JSON.parse(areasStr);
            return;
        }
        this.areas = [];
    }

    private fetchAreas(): void {
        let filter = new Filter();
        filter.pageSize = 1000;
        filter.available = true;
        this.areasService.fetch(filter).subscribe({
            next: (data: any) => {
                this.areas = data.areas;
            },
            error: (error) => {
                this.areas = [];
            }
        });
    }

    private getDataComponent(): void {
        const filter: Filter = new Filter();
        filter.pageSize = 1000;

        const rolRequest = this.rolService.fetch(filter);
        const userStateRequest = this.userStateService.fetch(filter);

        forkJoin([rolRequest, userStateRequest]).subscribe({
            next: ([rolResult, statesResult]) => {
                this.userStates = statesResult.states;
                this.roles = rolResult.roles;
            }
        });
    }

    private buildUserForm(): void {
        switch (this.dialogMode) {
            case 'create':
                this.userForm = this.formBuilder.group({
                    email: [null, [Validators.required, Validators.email]],
                    name: [null, [Validators.required, Validators.minLength(3)]],
                    rolId: [null, [Validators.required]],
                    areasCodes: [null, [Validators.required]]
                });
                break;
            case 'update':
            case 'delete':
                this.userForm = this.formBuilder.group({
                    email: [this.selectedUser.email, [Validators.required, Validators.email]],
                    name: [this.selectedUser.name, [Validators.required, Validators.minLength(3)]],
                    rolId: [this.selectedUser.rolId, [Validators.required]],
                    stateId: [this.selectedUser.stateId, [Validators.required]],
                    areasCodes: [this.selectedUser.areas?.map((area: Area) => area.areaId) ?? [], []]
                });
                break;
        }
    }

    onAreasChange(selected: any[] | any): void {
        const ids = Array.isArray(selected)
            ? selected.map(item => (item && typeof item === 'object' ? (item.areaId ?? item) : item))
            : [];
        this.userForm.get('areasCodes')?.setValue(ids);
        console.log(ids);
        console.log(this.userForm.value);
    }
}
