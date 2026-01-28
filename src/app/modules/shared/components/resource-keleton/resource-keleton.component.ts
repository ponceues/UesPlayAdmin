import { Component } from '@angular/core';
import { Skeleton } from 'primeng/skeleton';

@Component({
    selector: 'app-resource-keleton',
    imports: [Skeleton],
    templateUrl: './resource-keleton.component.html',
    styleUrl: './resource-keleton.component.scss'
})
export class ResourceKeletonComponent {
    count:number = 6;
}
