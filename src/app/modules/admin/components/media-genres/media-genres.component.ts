import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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
import { AppStorageService} from '@shared/services/app-storage/app-storage.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService, TooltipOptions } from 'primeng/api';
import { Meta } from '@shared/interfaces/meta';
import { Filter } from '@shared/interfaces/filter';
import { Envelop } from '@shared/interfaces/envelop';
import { MediaTypesService } from '@admin/services/media-types/media-types.service';

import { MediaGenreService } from '@admin/services/media-genre/media-genre.service';
import { MediaGenre } from '@admin/interfaces/media-genre';
import { MediaGenreComponent } from '@admin/components/media-genres/media-genre/media-genre.component';
import { MediaType } from '@admin/interfaces/media-type';



@Component({
    selector: 'app-media-genres',
    imports: [Button, DatatableSkeletonComponent, DatePipe, IconField, InputIcon, InputText, NgIf, ReactiveFormsModule, Select, TableModule, Tag, Tooltip],
    templateUrl: './media-genres.component.html',
    styleUrl: './media-genres.component.scss',
    providers: [DialogService]
})
export class MediaGenresComponent {
    private dialogService: DialogService = inject(DialogService);
    private formBuilder: FormBuilder = inject(FormBuilder);
    private messageService: MessageService = inject(MessageService);
    private appStorageService: AppStorageService = inject(AppStorageService);
    private mediaGenreService: MediaGenreService = inject(MediaGenreService);
    private mediaTypesService: MediaTypesService = inject(MediaTypesService);
    private route: ActivatedRoute = inject(ActivatedRoute);

    ref!: DynamicDialogRef;
    permissions: string[] = [];
    loadingPage: boolean = true;
    meta!: Meta;
    selectedMediaType!: MediaType;
    mediaGenres: MediaGenre[] = [];
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
        this.route.params.subscribe(params => {
            const mediaTypeId = params['mediaTypeId'];
            this.loadMediaType(mediaTypeId);
        });


        this.permissions = this.appStorageService.getPermissions().filter((x) => x.includes('genres'));
        this.buildEntitiesFilterForm();
    }

    loadMediaType(mediaTypeId: string): void {
        this.mediaTypesService.find(mediaTypeId).subscribe({
            next: (res: MediaType) => {
                this.selectedMediaType = res;
                this.loadInitialData();
            }
        })
    }

    clearFilters(): void {
        this.entitiesFilter = new Filter();
        this.entitiesFilterForm.reset();
        this.filteredEntities = false;
        this.fetchMediaGenres();
    }

    filterEntities(): void {
        this.filteredEntities = true;
        this.fetchMediaGenres();
    }

    showCreateEntity(): void {
        this.ref = this.dialogService.open(MediaGenreComponent, {
            header: 'Agreagar genero de multimedia',
            data: {
                mode: 'create',
                entity: null,
                typeId: this.selectedMediaType.typeId
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
                    detail: 'Genero de multimedia creado correctamente',
                    key: 'main'
                });
                this.fetchMediaGenres();
            }
        });
    }

    showUpdateEntity(entity: MediaGenre): void {
        this.ref = this.dialogService.open(MediaGenreComponent, {
            header: 'Editar genero de multimedia',
            data: {
                mode: 'update',
                entity: entity,
                typeId: this.selectedMediaType.typeId
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
                    detail: 'Genero actualizao correctamente',
                    key: 'main'
                });
                this.fetchMediaGenres();
            }
        });
    }

    showDelete(entity: MediaGenre): void {
        this.ref = this.dialogService.open(MediaGenreComponent, {
            header: 'Eliminar genero',
            data: {
                mode: 'delete',
                entity: entity,
                typeId: this.selectedMediaType.typeId
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
                    detail: 'Genero de multimedia eliminado',
                    key: 'main'
                });
                this.fetchMediaGenres();
            }
        });
    }

    fetchMediaGenres(event: any = null): void {
        if (event !== null) {
            this.entitiesFilter.page = event.first / event.rows;
        }

        if (this.filteredEntities) {
            let filterForm = this.entitiesFilterForm.value;

            if (filterForm.text != null) {
                this.entitiesFilter.text = filterForm.text;
            }
            if (filterForm.state != null) {
                this.entitiesFilter.enabled = filterForm.state;
            }
        }

        this.loadingEntities = true;
        this.mediaGenreService.fetch(this.entitiesFilter, this.selectedMediaType.typeId).subscribe({
            next: (res: Envelop<MediaGenre>) => {
                this.mediaGenres = res.mediaGenres;
                this.meta = res.meta;
                this.loadingEntities = false;
            },
            complete: () => {
                this.loadingEntities = false;
            }
        });
    }



    private loadInitialData(): void {
        this.mediaGenreService.fetch(this.entitiesFilter, this.selectedMediaType.typeId).subscribe({
            next: (res: Envelop<MediaGenre>) => {
                this.loadingPage = false;
                this.mediaGenres = res.mediaGenres;
                this.meta = res.meta;
            }
        });
    }

    private buildEntitiesFilterForm(): void {
        this.entitiesFilterForm = this.formBuilder.group({
            text: [null],
            state: [null]
        });
    }
}
