import { Component, Inject, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { Meta } from '@shared/interfaces/meta';
import { Filter } from '@shared/interfaces/filter';
import { MessageService, TooltipOptions } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';

import { Envelop } from '@shared/interfaces/envelop';
import { DatePipe, NgIf } from '@angular/common';
import { ResourceService } from '@admin/services/resources/resource.service';
import { Resource } from '@admin/interfaces/resource';
import { DatatableSkeletonComponent } from '@shared/components/datatable-skeleton/datatable-skeleton.component';
import { ResourceStatesEnum } from '@admin/enums/resource-states-enum';
import { ResourceType } from '@admin/interfaces/resource-type';
import { ResourceTypeService } from '@public/services/resource-types/resource-type.service';
import { Area } from '@admin/interfaces/area';
import { forkJoin } from 'rxjs';
import { Dialog } from 'primeng/dialog';
import { Message } from 'primeng/message';
import { Textarea } from 'primeng/textarea';
import { ResourceState } from '@admin/interfaces/resource-state';
import { ResourceStateService } from '@admin/services/resource-states/resource-state.service';
import { AppStorageService } from '@shared/services/app-storage/app-storage.service';
import { CatalogService } from '@public/services/catalogs/catalog.service';
import { MediaGenre } from '@public/interfaces/media-genre';
import { MediaType } from '@public/interfaces/media-type';

@Component({
    selector: 'app-resources',
    imports: [
        TableModule,
        DatePipe,
        TagModule,
        NgIf,
        DynamicDialogModule,
        ButtonModule,
        ChipModule,
        TooltipModule,
        InputTextModule,
        SelectModule,
        MultiSelectModule,
        FormsModule,
        IconField,
        InputIcon,
        ReactiveFormsModule,
        DatatableSkeletonComponent,
        Dialog,
        Message,
        Textarea
    ],
    templateUrl: './resources.component.html',
    styleUrl: './resources.component.scss',
    providers: [DialogService]
})
export class ResourcesComponent {
    private router = inject(Router);
    private formBuilder = inject(FormBuilder);
    private resourceService: ResourceService = inject(ResourceService);
    private resourceTypeService: ResourceTypeService = inject(ResourceTypeService);
    private resourceStateService: ResourceStateService = inject(ResourceStateService);
    private appStorageService: AppStorageService = inject(AppStorageService);
    private catalogService: CatalogService = inject(CatalogService);

    permissions: string[] = [];
    resourceStatesEnum = ResourceStatesEnum;
    loadingPage: boolean = true;
    resources: Resource[] = [];
    mediaGenres: MediaGenre[] = [];
    mediaTypes: MediaType[] = [];
    filter: Filter = new Filter();
    genres : MediaGenre[] = [];
    selectedType : ResourceType| null = null;

    meta!: Meta;
    filterForm!: FormGroup;
    loadingTable: boolean = false;
    filteredTable: boolean = false;
    availableFiltered: boolean = false;

    areas: Area[] = [];
    resourceTypes: ResourceType[] = [];
    httpLoading: boolean = false;
    createform!: FormGroup;
    showCreate: boolean = false;

    selectedResource: Resource | null = null;
    resourceStates: ResourceState[] = [];
    showStateModal: boolean = false;
    selectedState: ResourceState | null = null;
    loadingStates: boolean = true;

    constructor(
        @Inject('DefaultTooltipOptions') public tooltipOption: TooltipOptions,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.loadComponentData();
        this.buildFilterForm();
        this.loadAreas();
        this.permissions = this.appStorageService.getPermissions().filter((x) => x.includes('resources'));
    }

    loadComponentData(): void {
        this.loadingPage = true;
        const filter = new Filter();
        filter.pageSize = 1000;

        forkJoin({
            resourceTypes: this.resourceTypeService.fetchByFilter(filter),
            resources: this.resourceService.fetch(this.filter),
            statesRequest: this.resourceStateService.fetch(filter),
            mediaTypesRequest: this.catalogService.fetchMediaTypes(filter),
            mediaGenresRequest: this.catalogService.fetchMediaGenres(filter)
        }).subscribe({
            next: ({ resourceTypes, resources, statesRequest, mediaTypesRequest, mediaGenresRequest }) => {
                this.resourceStates = statesRequest.states;
                this.resourceTypes = resourceTypes.types;
                this.resources = resources.resources;
                this.mediaGenres  = mediaGenresRequest.mediaGenres;
                this.mediaTypes = mediaTypesRequest.mediaTypes;
                this.loadingPage = false;
                this.meta = resources.meta;
                this.buildCreateForm();
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Ha ocurrido un error inesperado',
                    key: 'main'
                });
            }
        });
    }

    clearFilters(): void {
        this.filter = new Filter();
        this.filteredTable = false;
        this.availableFiltered = false;
        this.filterForm.reset();
        this.fetchResources();
    }

    createResource(): void {
        this.httpLoading = true;
        let request = this.createform.value;
        this.resourceService.create(request).subscribe({
            next: (res: Resource) => {
                this.router.navigate([`/admin/resources/${res.resourceId}`]);
            },
            error: () => {
                this.httpLoading = false;
            }
        });
    }

    manageResource(entity: Resource): void {
        this.router.navigate([`/admin/resources/${entity.resourceId}`]);
    }

    cleanCreateModal(): void {
        this.createform.reset();
        this.createform.get('genreId')?.setValue(null);
        this.createform.get('mediaTypeId')?.setValue(null);
        this.selectedType = null;
    }

    showUpdateState(entity: Resource): void {
        this.selectedResource = entity;
        this.selectedState = this.selectedResource.state;
        this.showStateModal = true;
    }

    updateResourceState(): void {
        this.httpLoading = true;
        let request = this.selectedResource;
        request!.state = this.selectedState;
        request!.stateId = <string>this.selectedState?.stateId;

        this.resourceService.updateState(request!).subscribe({
            next: (res: Resource) => {
                this.httpLoading = false;
                this.showStateModal = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Recurso actualizado con exito',
                    key: 'main'
                });
                this.fetchResources();
            }
        });
    }

    fetchResources(event: any = null): void {
        this.filteredTable = false;
        if (event !== null) {
            this.filter.page = event.first / event.rows;
        }

        let formValue = this.filterForm.value;
        if (formValue.text !== null) {
            this.filter.text = formValue.text;
            this.filteredTable = true;
        }

        if (formValue.stateId !== null) {
            this.filter.stateId = formValue.stateId;
            this.filteredTable = true;
        }

        if (formValue.areaId !== null) {
            this.filter.areaId = formValue.areaId;
            this.filteredTable = true;
        }

        this.loadingTable = true;
        this.resourceService.fetch(this.filter).subscribe({
            next: (res: Envelop<Resource>) => {
                this.loadingTable = false;
                this.resources = res.resources;
                this.meta = res.meta;
            }
        });
    }

    previewResource(entity: Resource): void {
        const url = this.router.createUrlTree([`admin/recursos/preview`], { queryParams: { resourceId: entity.resourceId } }).toString();
        window.open(url, '_blank');
    }

    setResourceType(resourceTypeId: string): void {
        this.selectedType = null;
        this.createform.get('genreId')?.setValue(null);
        let resourceType = this.resourceTypes.find((x) => x.typeId === resourceTypeId);
        if (resourceType?.code === 'MEDIA') {
            const genderControl = this.createform.get('genreId');
            const typeControl = this.createform.get('mediaTypeId');
            genderControl?.setValidators([Validators.required]);
            typeControl?.setValidators([Validators.required]);
            genderControl?.updateValueAndValidity();
            typeControl?.updateValueAndValidity();
            this.selectedType = resourceType;
        }
    }

    updateGenres(typeId:string): void {
        this.createform.get('genreId')?.setValue(null);
        this.genres = this.mediaGenres.filter((x) => x.mediaTypeId === typeId);
    }

    //#region privates
    private fetchResourceStates(): void {
        this.loadingPage = true;
        let quickFilter = new Filter();
        quickFilter.pageSize = 1000;
        this.resourceStateService.fetch(quickFilter).subscribe({
            next: (res) => {
                this.resourceStates = res.states;
                this.resourceStates = this.resourceStates.filter((x) => x.code !== this.resourceStatesEnum.Created);
            }
        });
    }

    private loadAreas(): void {
        try {
            let strArea = localStorage.getItem('areas');
            this.areas = JSON.parse(strArea!);
        } catch (error) {
            this.areas = [];
        }
    }

    private buildCreateForm(): void {
        this.createform = this.formBuilder.group({
            typeId: [null, [Validators.required]],
            areaId: [null, [Validators.required]],
            title: [null, [Validators.required]],
            description: [null, [Validators.required]],
            genreId: [null],
            mediaTypeId: [null]
        });
    }

    private buildFilterForm(): void {
        this.filterForm = this.formBuilder.group({
            stateId: [null],
            text: [null],
            areaId: [null]
        });

        this.filterForm.valueChanges.subscribe((value) => {
            this.availableFiltered = true;
        });
    }
    //#endregion
}
