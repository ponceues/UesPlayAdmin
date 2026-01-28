import { Component, OnInit } from '@angular/core';
import { Skeleton } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-datatable-skeleton',
    imports: [Skeleton, TableModule],
    templateUrl: './datatable-skeleton.component.html',
    styleUrl: './datatable-skeleton.component.scss'
})
export class DatatableSkeletonComponent implements OnInit {
    skeletons: any[] | undefined;

    ngOnInit() {
        this.skeletons = Array.from({ length: 10 }).map((_, i) => `Item #${i}`);
    }
}
