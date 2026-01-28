import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import {Observable,throwError} from 'rxjs';
import {HttpClient,HttpErrorResponse} from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

import { Filter } from '@shared/interfaces/filter';
import { Envelop } from '@shared/interfaces/envelop';
import {License } from '@admin/interfaces/license';

@Injectable({
  providedIn: 'root'
})
export class LicensesService {
    private uesPlayApi =`${environment.UesPlayApi}/admin/licenses`;

    constructor(private http:HttpClient) { }

    fetch(filter:Filter):Observable<Envelop<License>>{
        let requestUrl = `${this.uesPlayApi}?page=${filter.page}&pageSize=${filter.pageSize}`;

        if(filter.text !== null){
            requestUrl = `${requestUrl}&text=${filter.text}`;
        }

        if(filter.state !== null){
            requestUrl = `${requestUrl}&enabled=${filter.enabled}`;
        }

        return this.http.get<Envelop<License>>(
            `${requestUrl}`
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }

    create(request:any):Observable<License>{
        let requestUrl = `${this.uesPlayApi}`;

        return this.http.post<License>(
            requestUrl,
            request
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }

    update(license:License):Observable<License>{
        let requestUrl = `${this.uesPlayApi}/${license.licenceId}`;

        return this.http.post<License>(
            requestUrl,
            license
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }

    delete(license:License):Observable<any>{
        let requestUrl = `${this.uesPlayApi}/${license.licenceId}`;

        return this.http.delete<any>(
            requestUrl
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }

    private handleErrors(error: HttpErrorResponse): Observable<never>  {
        return throwError(()=>error.error);
    }
}
