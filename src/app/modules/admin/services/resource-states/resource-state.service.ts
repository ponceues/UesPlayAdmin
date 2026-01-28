import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Filter } from '@shared/interfaces/filter';
import { Observable, throwError } from 'rxjs';
import { Envelop } from '@shared/interfaces/envelop';
import { Resource } from '@admin/interfaces/resource';
import { catchError } from 'rxjs/operators';
import { ResourceState } from '@admin/interfaces/resource-state';

@Injectable({
  providedIn: 'root'
})
export class ResourceStateService {
    private uesPlayApi =`${environment.UesPlayApi}/uesplay/catalogs/resourceStates`;

    constructor(private http:HttpClient) { }

    fetch(filter:Filter):Observable<Envelop<ResourceState>>{
        let requestUrl = `${this.uesPlayApi}?page=${filter.page}&pageSize=${filter.pageSize}`;

        return this.http.get<Envelop<ResourceState>>(
            `${requestUrl}`
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }


    private handleErrors(error: HttpErrorResponse): Observable<never>  {
        return throwError(()=>error.error);
    }
}
