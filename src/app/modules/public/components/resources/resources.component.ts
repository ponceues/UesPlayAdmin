import { Component, inject, OnInit } from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import {forkJoin} from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

import { ChipModule } from 'primeng/chip';
import { CardModule } from 'primeng/card';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { RatingModule } from 'primeng/rating';

import { Filter } from '@shared/interfaces/filter';
import { ResourceType } from    '@public/interfaces/resource-type';
import { EResourceType } from   '@public/enums/resource-type-enum';
import { PlatformService } from '@public/services/platform/platform.service';
import { DeviceService } from   '@public/services/device/device.service';
import { LayoutService } from   '@public/services/layaut/layout.service';

import { Resource } from    '@public/interfaces/resource';
import { Platform } from    '@public/interfaces/platform';
import { Device } from      '@public/interfaces/device';
import { ResourcesSkeletonComponent } from '@shared/components/resources-skeleton/resources-skeleton.component';
import { ResourcesService } from '@public/services/resources/resources.service';
import { FooterComponent } from '@shared/components/footer/footer.component';
import {CatalogService} from '@public/services/catalogs/catalog.service';
import { MediaType } from '@public/interfaces/media-type';
import { Select } from 'primeng/select';
import { MediaGenre } from '@public/interfaces/media-genre';
import { FormsModule } from '@angular/forms';


@Component({
    selector: 'app-resources',
    imports: [
        NgIf,
        NgForOf,
        ChipModule,
        NgClass,
        CardModule,
        RippleModule,
        AvatarModule,
        OverlayBadgeModule,
        RatingModule,
        ResourcesSkeletonComponent,
        FooterComponent,
        Select,
        FormsModule
    ],
    templateUrl: './resources.component.html',
    styleUrl: './resources.component.scss'
})

export class ResourcesComponent implements OnInit {
    private layoutService: LayoutService = inject(LayoutService);
    private deviceService: DeviceService = inject(DeviceService);
    private platformService: PlatformService = inject(PlatformService);
    private router: Router = inject(Router);
    private resourceService: ResourcesService = inject(ResourcesService);
    private catalogService: CatalogService = inject(CatalogService);


    selectedType?: ResourceType;
    loadingPage:boolean = true;
    resourceTypeEnum= EResourceType;
    platformsList: Platform[] = [];
    devicesList: Device[] = [];
    selectedPlatform: Platform | null = null;
    selectedDevice: Device|null = null;
    selectedMediaType:MediaType|null = null;
    resources:Resource[]=[];
    loadingResources: boolean=true;
    types:MediaType[]=[];
    mediaGenres: MediaGenre[]=[];
    genres:MediaGenre[]=[];


    ngOnInit(): void {
        this.setResourceTypeListener();
        this.buildComponent();
    }

    goToResourceDetail(resource:Resource):void{
        switch (this.selectedType?.code){
            case this.resourceTypeEnum.Game:
                this.router.navigate([`/recursos/recurso`],{queryParams:{resourceId: resource.resourceId}});
                break;
            case this.resourceTypeEnum.Application:
                this.router.navigate([`/recursos/recurso`],{queryParams:{resourceId: resource.resourceId}});
                break;
            case this.resourceTypeEnum.Multimedia:
                this.router.navigate([`/recursos/recurso`],{queryParams:{resourceId: resource.resourceId}});
                break;
        }

    }

    setSelectedPlatform(platform:Platform):void {
        if(platform === this.selectedPlatform){
            this.selectedPlatform = null;
            this.fetchResources();
            return ;
        }

        this.selectedPlatform = platform;
        this.selectedDevice = null;
        this.fetchResources();
    }

    setSelectedDevice(device:Device):void {
        if(device === this.selectedDevice){
            this.selectedDevice = null;
            this.fetchResources();
            return ;
        }
        this.selectedDevice = device;
        this.selectedPlatform = null;
        this.fetchResources();
    }

    fetchResources():void {
        this.loadingResources = true;
        let quickFilter = new Filter();
        quickFilter.typeId = this.selectedType!.typeId;

        if(this.selectedDevice !== null){
            quickFilter.deviceId = this.selectedDevice?.deviceId;
        }

        if(this.selectedPlatform !== null){
            quickFilter.platformId = this.selectedPlatform.platformId;
        }

        this.resourceService.search(quickFilter).subscribe({
            next: response => {
                this.loadingPage = false;
                this.loadingResources = false;
                this.resources = response.resources;
            }
        })

    }

    getResourceImage(entity:Resource, option: 'avatar'| 'banner'|'media'): string{
        if(option === 'avatar'){
            let file = entity.files.find(f => f.option === 'avatar');
            return  file?.url || '';
        }
        if(option === 'banner'){
            let file = entity.files.find(f => f.option === 'banner');
            return  file?.url || '';
        }
        return 'assets/images/no-image.png';
    }

    getStarsArray(rating: number): string[] {
        const stars: string[] = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const totalStars = 5;

        // Add full stars
        for (let i = 0; i < fullStars; i++) {
            stars.push('pi pi-star-fill');
        }

        // Add half star if applicable
        if (hasHalfStar && fullStars < totalStars) {
            stars.push('pi pi-star-half-fill');
        }

        // Add empty stars
        const emptyStars = totalStars - stars.length;
        for (let i = 0; i < emptyStars; i++) {
            stars.push('pi pi-star');
        }

        return stars;
    }


    onMediaTypeChange(event: any):void{
        this.mediaGenres = [];
        if(event.value){
            let values = this.genres.filter(x=>x.mediaTypeId === event.value.typeId);
            this.mediaGenres = values;
        }
    }

    private buildComponent(): void {
        const filter: Filter = new Filter();
        filter.pageSize = 500;

        const platformsRequest = this.platformService.fetchByFilter(filter);
        const devicesRequest = this.deviceService.fetchByFilter(filter);
        const typeRequest = this.catalogService.fetchMediaTypes(filter);
        const genresRequest = this.catalogService.fetchMediaGenres(filter);
        forkJoin([platformsRequest,devicesRequest, typeRequest, genresRequest]).subscribe({
            next: ([platformsResult,devicesResult, typeRes,  genreRes]) => {
                this.devicesList = devicesResult.devices;
                this.platformsList = platformsResult.platforms;
                this.types = typeRes.mediaTypes;
                this.genres = genreRes.mediaGenres;
                this.loadingPage = false;
            }
        });
    }

    private setResourceTypeListener(): void {
        this.layoutService.resourceType$.subscribe({
            next: (resourceType:ResourceType) => {
                this.selectedType = resourceType;
                this.selectedPlatform = null;
                this.selectedDevice = null;
                this.fetchResources();
            }
        });
    }

}

