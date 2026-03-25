import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Filter } from '@shared/interfaces/filter';
import { Observable, throwError } from 'rxjs';
import { Envelop } from '@shared/interfaces/envelop';
import { Permission } from '../../interfaces/permission';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class PermissionService {

    private httpClient:HttpClient = inject(HttpClient);
    private uesPlayApi =`${environment.UesPlayApi}/admin/permissions`;

    constructor() { }

    fetch(filter:Filter):Observable<Envelop<Permission>>{
        let requestUrl = `${this.uesPlayApi}?page=${filter.page}&pageSize=${filter.pageSize}`;

        return this.httpClient.get<Envelop<Permission>>(
            `${requestUrl}`
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }

    private handleErrors(error: HttpErrorResponse): Observable<never>  {
        return throwError(()=>error.error);
    }
}
