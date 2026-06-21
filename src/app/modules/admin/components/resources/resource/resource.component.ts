import { Component, Inject, inject } from '@angular/core';
import { ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Area } from '@admin/interfaces/area';
import { ResourceType } from '@admin/interfaces/resource-type';
import { Resource } from '@admin/interfaces/resource';
import { Filter } from '@shared/interfaces/filter';
import { forkJoin } from 'rxjs';
import { MessageService, TooltipOptions } from 'primeng/api';
import { AreasService } from '@admin/services/areas/areas.service';
import { ResourceService } from '@admin/services/resources/resource.service';
import { ResourceTypeService } from '@public/services/resource-types/resource-type.service';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { Select } from 'primeng/select';
import { Textarea } from 'primeng/textarea';
import { ActivatedRoute } from '@angular/router';
import { Button } from 'primeng/button';
import { Panel } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { Author } from '@admin/interfaces/author';
import { AuthorService } from '@admin/services/authors/author.service';
import { Dialog } from 'primeng/dialog';
import { Version } from '@admin/interfaces/version';
import { VersionService } from '@admin/services/versions/version.service';
import { Language } from '@admin/interfaces/language';
import { Platform } from '@admin/interfaces/platform';
import { Device } from '@admin/interfaces/device';
import { MultiSelect } from 'primeng/multiselect';
import { FileUpload, FileUploadEvent } from 'primeng/fileupload';
import { Tag } from 'primeng/tag';
import { CardSkeletonComponent } from '@shared/components/card-skeleton/card-skeleton.component';
import { ResourceFile } from '@admin/interfaces/resource-file';
import { ResourceFileService } from '@admin/services/resource-files/resource-file.service';
import { Tooltip } from 'primeng/tooltip';
import { ResourceStateService } from '@admin/services/resource-states/resource-state.service';
import { ResourceStatesEnum } from '@admin/enums/resource-states-enum';
import { ResourceState } from '@admin/interfaces/resource-state';
import { FileComponent } from '@admin/components/resources/file/file.component';
import { LucideAngularModule } from 'lucide-angular';
import { License } from '@admin/interfaces/license';
import { CommonsService } from '@admin/services/commons/commons.service';
import { AppStorageService } from '@shared/services/app-storage/app-storage.service';
import { MediaType } from '@public/interfaces/media-type';
import { MediaGenre } from '@public/interfaces/media-genre';
import { CatalogService } from '@public/services/catalogs/catalog.service';


@Component({
    selector: 'app-resource',
    imports: [FormsModule, InputText, Message, NgIf, ReactiveFormsModule, Select, Textarea, Button, Panel, TableModule, Dialog, MultiSelect, FileUpload, DatePipe, Tag, NgForOf, CardSkeletonComponent, Tooltip, FileComponent, LucideAngularModule],
    templateUrl: './resource.component.html',
    styleUrl: './resource.component.scss'
})
export class ResourceComponent {
    private formBuilder = inject(FormBuilder);
    private resourceTypeService: ResourceTypeService = inject(ResourceTypeService);
    private resourceService: ResourceService = inject(ResourceService);
    private route: ActivatedRoute = inject(ActivatedRoute);
    private messageService: MessageService = inject(MessageService);
    private authorService: AuthorService = inject(AuthorService);
    private versionService: VersionService = inject(VersionService);
    private resourceFileService: ResourceFileService = inject(ResourceFileService);
    private resourceStateService: ResourceStateService = inject(ResourceStateService);
    private commonService: CommonsService = inject(CommonsService);
    private appStorageService: AppStorageService = inject(AppStorageService);
    private catalogsService:CatalogService = inject(CatalogService);

    @ViewChild('resourceFileUpload') resourceFileUpload!: FileUpload;
    permissions: string[] = [];
    selectedResource!: Resource;
    resourceForm!: FormGroup;
    areas: Area[] = [];
    resourceTypes: ResourceType[] = [];
    resourceStates: ResourceState[] = [];
    httpLoading: boolean = false;
    loadingPage: boolean = true;
    loadingAuthors: boolean = true;
    licenses: License[] = [];
    mediaTypes:MediaType[] = [];
    genres:MediaGenre[] = [];
    authors: Author[] = [];
    authorForm!: FormGroup;
    showAuthorModal: boolean = false;

    versions: Version[] = [];
    languages: Language[] = [];
    platforms: Platform[] = [];
    devices: Device[] = [];
    versionForms!: FormGroup;
    loadingVersions: boolean = true;
    showVersionModal: boolean = false;

    resourceFiles: ResourceFile[] = [];
    avatar: ResourceFile | null = null;
    banner: ResourceFile | null = null;
    showFileModal: boolean = false;
    loadingFiles: boolean = true;
    fileForm!: FormGroup;

    resourceStateEnums = ResourceStatesEnum;

    constructor(@Inject('DefaultTooltipOptions') public tooltipOption: TooltipOptions) {
        const routeParam = this.route.snapshot.paramMap.get('resourceId');
        const resourceId = routeParam;
        if (resourceId) {
            this.loadComponentData(resourceId);
            this.buildAuthorForm();
        }
        this.permissions = this.appStorageService.getPermissions().filter((x) => x.includes('resources'));
    }

    updateResource(): void {
        const request = this.resourceForm.value;
        this.selectedResource.title = request.title;
        this.selectedResource.description = request.description;
        this.selectedResource.type = request.type;
        this.httpLoading = true;

        this.resourceService.update(this.selectedResource).subscribe({
            next: (res: Resource) => {
                this.selectedResource = res;
                this.httpLoading = false;
                this.messageService.add({
                    severity: 'success',
                    detail: 'Recurso actualizado con exito',
                    key: 'main'
                });
            },
            error: (err) => {
                this.httpLoading = false;
            }
        });
    }

    updateResourceState(): void {
        let state = this.resourceStates.filter((x) => x.code === this.resourceStateEnums.Pending)[0];
        let resourceUpdate: Resource = this.selectedResource;

        if (state) {
            this.httpLoading = true;
            resourceUpdate.stateId = state.stateId;
            this.httpLoading = true;
            this.resourceService.updateState(resourceUpdate).subscribe({
                next: (res: Resource) => {
                    this.selectedResource = res;
                    this.httpLoading = false;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Solicitud completa',
                        detail: 'El recurso se actualizado con exito',
                        key: 'main'
                    });
                },
                error: (err) => {
                    this.httpLoading = false;
                }
            });
        }
    }

    createAuthor(): void {
        const request = this.authorForm.value;
        this.httpLoading = true;
        this.authorService.create(this.selectedResource.resourceId, request).subscribe({
            next: (res: Author) => {
                this.fetchAuthors();
                this.httpLoading = false;
                this.showAuthorModal = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Solicitud completa',
                    detail: 'Autor agregado con exito'
                });
            },
            error: (err) => {
                this.httpLoading = false;
            }
        });
    }

    deleteAuthor(entity: Author): void {
        this.authorService.delete(this.selectedResource.resourceId, entity.authorId).subscribe({
            next: (res: any) => {
                this.fetchAuthors();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Solicitud completa',
                    detail: 'Autor se ha removido con exito',
                    key: 'main'
                });
            }
        });
    }

    onSelectFile(event: any): void {
        const file = event.files[0];
        this.versionForms.get('file')?.setValue(file);
    }

    onClearFile(): void {
        this.versionForms.get('file')?.setValue(null);
    }

    createVersion(): void {
        const formValues = this.versionForms.value;
        let request = new FormData();
        request.append('resourceId', String(formValues.resourceId));
        request.append('version', String(formValues.version));
        request.append('description', String(formValues.description));
        request.append('platforms', JSON.stringify(formValues.platforms));
        request.append('langs', JSON.stringify(formValues.langs));
        request.append('devices', JSON.stringify(formValues.devices));
        request.append('source', formValues.file);
        request.append('licenseId', String(formValues.licenseId));
        this.httpLoading = true;
        this.versionService.create(this.selectedResource.resourceId, request).subscribe({
            next: (res: Version) => {
                this.httpLoading = false;
                this.fetchVersions();
                this.showVersionModal = false;
            },
            error: (err) => {
                this.httpLoading = false;
            }
        });
    }

    onSelectResourceFile(event: any): void {
        const file = event.files[0];
        this.fileForm.get('file')?.setValue(file);
        let type: string = file.type.startsWith('image/') ? 'image' : 'video';
        this.fileForm.get('type')?.setValue(type);
    }

    onClearResourceFile(): void {
        this.fileForm.get('file')?.setValue(null);
    }

    createResourceFile(): void {
        const formValues = this.fileForm.value;
        let request = new FormData();
        request.append('file', formValues.file);
        request.append('option', formValues.option);
        request.append('type', formValues.type);

        this.httpLoading = true;
        this.resourceFileService.create(this.selectedResource.resourceId, request).subscribe({
            next: (res: ResourceFile) => {
                this.httpLoading = false;
                this.fetchFiles();
                this.showFileModal = false;
                this.fileForm.reset();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Completado',
                    detail: 'Archivo agregado con exito',
                    key: 'main'
                });
                if (this.resourceFileUpload) {
                    this.resourceFileUpload.clear();
                }
            },
            error: () => {
                this.httpLoading = false;
            }
        });
    }

    removeResourceFile(entity: ResourceFile): void {
        this.resourceFileService.delete(this.selectedResource.resourceId, entity.fileId).subscribe({
            next: (res: ResourceFile) => {
                this.httpLoading = true;
                this.fetchFiles();
                this.messageService.add({
                    severity: 'success',
                    detail: 'Archivo eliminado con exito',
                    key: 'main'
                });
            }
        });
    }

    showFileModalFn(option: string): void {

        this.fileForm.reset();
        this.fileForm.get('option')?.setValue(option);
        this.showFileModal = true;
    }

    downloadVersionFile(entity: Version): void {
        this.versionService.download(this.selectedResource.resourceId, entity.versionId).subscribe({
            next: (res: Blob) => {
                const url = window.URL.createObjectURL(res);
                const a = document.createElement('a');
                a.href = url;

                a.download = `${this.selectedResource.title}-v${entity.version}.zip`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }
        });
    }

    //#region private methods

    private loadComponentData(resourceId: string): void {
        const quickFilter = new Filter();
        quickFilter.pageSize = 1000;

        forkJoin({
            areas: this.commonService.listAreas(quickFilter),
            resourceTypes: this.resourceTypeService.fetchByFilter(quickFilter),
            resource: this.resourceService.find(resourceId),
            resourceStates: this.resourceStateService.fetch(quickFilter),
            licensesRes: this.commonService.listLicences(quickFilter),
            mediaTypeRes: this.catalogsService.fetchMediaTypes(quickFilter),
            genreRes: this.catalogsService.fetchMediaGenres(quickFilter)
        }).subscribe({
            next: ({ areas, resourceTypes, resource, resourceStates, licensesRes,mediaTypeRes,genreRes }) => {
                this.areas = areas.areas;
                this.resourceTypes = resourceTypes.types;
                this.selectedResource = resource;
                this.resourceStates = resourceStates.states;
                this.mediaTypes = mediaTypeRes.mediaTypes;
                this.genres = genreRes.mediaGenres;
                this.loadingPage = false;
                this.buildCreateForm();
                this.fetchAuthors();
                this.fetchVersions();
                this.loadingFiles = true;
                this.fetchFiles();
                this.licenses = licensesRes.licences;
            },
            error: () => {}
        });

        forkJoin({
            platforms: this.commonService.listPlatforms(quickFilter),
            devices: this.commonService.listDevices(quickFilter),
            languages: this.commonService.listLanguages(quickFilter)
        }).subscribe({
            next: ({ devices, platforms, languages }) => {
                this.devices = devices.devices;
                this.platforms = platforms.platforms;
                this.languages = languages.languages;
            },
            error: () => {}
        });
    }

    private fetchAuthors(): void {
        const quickFilter = new Filter();
        quickFilter.pageSize = 1000;

        this.authorService.fetch(this.selectedResource.resourceId, quickFilter).subscribe({
            next: (res) => {
                this.authors = res.authors;
                this.loadingAuthors = false;
            }
        });
    }

    private fetchVersions(): void {
        const quickFilter = new Filter();
        quickFilter.pageSize = 1000;

        this.versionService.fetch(this.selectedResource.resourceId, quickFilter).subscribe({
            next: (res) => {
                this.versions = res.versions;
                this.loadingVersions = false;
                this.buildVersionForm();
            }
        });
    }

    private fetchFiles(): void {
        const quickFilter = new Filter();
        quickFilter.pageSize = 1000;

        this.resourceFileService.fetch(this.selectedResource.resourceId, quickFilter).subscribe({
            next: (res) => {
                this.resourceFiles = res.files;
                this.loadingFiles = false;
                this.avatar = this.resourceFiles.filter((x) => x.option === 'avatar')[0] || null;
                this.banner = this.resourceFiles.filter((x) => x.option === 'banner')[0] || null;
                this.buildFileForm();
            }
        });
    }

    private buildAuthorForm(): void {
        this.authorForm = this.formBuilder.group({
            firstName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]]
        });
    }

    private buildFileForm(): void {
        this.fileForm = this.formBuilder.group({
            type: [null, [Validators.required]],
            option: [null, [Validators.required]],
            file: [null, [Validators.required]]
        });
    }

    private buildVersionForm(): void {
        this.versionForms = this.formBuilder.group({
            version: [null, [Validators.required]],
            description: [null, [Validators.required]],
            resourceId: [this.selectedResource.resourceId, [Validators.required]],
            langs: [null, [Validators.required]],
            platforms: [null, [Validators.required]],
            devices: [null, [Validators.required]],
            file: [null, [Validators.required]],
            licenseId: [null, [Validators.required]]
        });
    }

    private buildCreateForm(): void {
        this.resourceForm = this.formBuilder.group({
            typeId: [this.selectedResource.typeId, [Validators.required]],
            areaId: [this.selectedResource.areaId , [Validators.required]],
            title: [this.selectedResource.title, [Validators.required]],
            description: [this.selectedResource.description, [Validators.required]],
            mediaTypeId: [this.selectedResource.mediaTypeId,[Validators.required]],
            genreId:[this.selectedResource.genreId,[Validators.required]]
        });
    }

    //#endregion
}
