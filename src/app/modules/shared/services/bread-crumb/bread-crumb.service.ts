import { Injectable } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BehaviorSubject,Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class BreadCrumbService {
    private breadcrumbItems = new BehaviorSubject<MenuItem[]> ([{label:'UesPlay',disabled:true}]);
    public breadCrumbList$ =this.breadcrumbItems.asObservable();
    constructor() { }

    public getBreadCrumbList():Observable<MenuItem[]>{
        return this.breadcrumbItems;
    }

    public setViewBreadCrumb(breadCrumbs:MenuItem[] ){
        console.log("setViewBreadCrumb");
        this.breadcrumbItems.next(breadCrumbs);
    }
}
