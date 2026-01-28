import { Component } from '@angular/core';
import { Skeleton } from 'primeng/skeleton';

@Component({
    selector: 'app-picklist-skeleton',
    imports: [Skeleton],
    templateUrl: './picklist-skeleton.component.html',
    styleUrl: './picklist-skeleton.component.scss'
})
export class PicklistSkeletonComponent {}
