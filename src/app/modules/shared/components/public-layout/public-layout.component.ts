import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet, Router, ActivatedRoute } from '@angular/router';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { Filter } from '@shared/interfaces/filter';
import { ResourceTypeService} from '@public/services/resource-types/resource-type.service';
import { ResourceType} from '@public/interfaces/resource-type';
import { LayoutService } from '@public/services/layaut/layout.service';
import { EResourceType } from   '@public/enums/resource-type-enum';
import { AppConfigurator } from '../../../../layout/component/app.configurator';
import { SharedModule } from '@shared/shared.module';

@Component({
    selector: 'app-public-layout',
    imports: [RouterLink, NgForOf, RouterOutlet, NgClass, NgIf, AppConfigurator, SharedModule],
    templateUrl: './public-layout.component.html',
    styleUrl: './public-layout.component.scss'
})
export class PublicLayoutComponent implements OnInit {
    private resourceTypeService: ResourceTypeService = inject(ResourceTypeService);
    private layoutService: LayoutService = inject(LayoutService);
    private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
    private router: Router = inject(Router);

    loadingPage: boolean = true;
    resourceTypes: ResourceType[] = [];
    selectedResourceType: ResourceType | null = null;
    resourceTypeEnum = EResourceType;

    ngOnInit(): void {
        this.build();
    }

    setSelectedType(item: ResourceType): void {
        this.selectedResourceType = item;
    }

    navigateToUrl(item: ResourceType): void {
        this.selectedResourceType = item;
        this.layoutService.setSelectedResourceType(this.selectedResourceType!);
        switch (item.code) {
            case this.resourceTypeEnum.Game:
                this.router.navigate(['recursos'], { queryParams: { type: 'juegos' } });
                break;
            case this.resourceTypeEnum.Application:
                this.router.navigate(['recursos'], { queryParams: { type: 'aplicaciones' } });
                break;
            case this.resourceTypeEnum.Multimedia:
                this.router.navigate(['recursos'], { queryParams: { type: 'multimedia' } });
                break;
        }
    }

    private build(): void {
        const filter: Filter = new Filter();
        filter.pageSize = 1000;

        this.resourceTypeService.fetchByFilter(filter).subscribe({
            next: (result) => {
                this.resourceTypes = result.types;
                this.findAndSetType();
            }
        });
    }

    goToLogin(): void {
        this.router.navigate(['/auth/login']);
    }

    findAndSetType(): void {
        this.activatedRoute.firstChild?.params.subscribe((params) => {
            let type = params['type'] || null;
            switch (type) {
                case 'juegos':
                    this.selectedResourceType = this.resourceTypes.filter((x) => x.code === this.resourceTypeEnum.Game)[0];
                    break;
                case 'aplicaciones':
                case null:
                    this.selectedResourceType = this.resourceTypes.filter((x) => x.code === this.resourceTypeEnum.Application)[0];
                    break;
                case 'multimedia':
                    this.selectedResourceType = this.resourceTypes.filter((x) => x.code === this.resourceTypeEnum.Multimedia)[0];
                    break;
                default:
                    this.selectedResourceType = this.resourceTypes.filter((x) => x.code === this.resourceTypeEnum.Application)[0];
                    break;
            }

            this.layoutService.setSelectedResourceType(this.selectedResourceType!);
            this.setSelectedType(this.selectedResourceType!);
            this.loadingPage = false;
        });
    }
}
