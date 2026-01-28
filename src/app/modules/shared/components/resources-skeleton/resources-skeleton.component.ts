import { Component } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';
import { NgForOf } from '@angular/common';

@Component({
    selector: 'app-resources-skeleton',
    imports: [SkeletonModule, NgForOf],
    templateUrl: './resources-skeleton.component.html',
    styleUrl: './resources-skeleton.component.scss'
})
export class ResourcesSkeletonComponent {
    count:number = 6;
}
