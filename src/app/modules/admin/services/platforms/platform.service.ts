import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Filter } from '@shared/interfaces/filter';
import { Observable, throwError } from 'rxjs';
import { Envelop } from '@shared/interfaces/envelop';
import { catchError } from 'rxjs/operators';

import { Platform } from '@admin/interfaces/platform';
import { Summary } from '@admin/interfaces/sumary';

@Injectable({
  providedIn: 'root'
})
export class PlatformService {

    private http:HttpClient = inject(HttpClient);
    private uesPlayApi =`${environment.UesPlayApi}/admin/platforms`;


    fetch(filter:Filter):Observable<Envelop<Platform>>{
        let requestUrl = `${this.uesPlayApi}?page=${filter.page}&pageSize=${filter.pageSize}`;

        if(filter.text != null){
            requestUrl = `${requestUrl}&text=${filter.text}`;
        }
        if(filter.state != null){
            requestUrl = `${requestUrl}&available=${filter.state}`;
        }

        return this.http.get<Envelop<Platform>>(
            `${requestUrl}`
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }

    create(entity:Platform):Observable<Platform>{
        let requestUrl = `${this.uesPlayApi}`;

        return this.http.post<Platform>(
            `${requestUrl}`,
            entity
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }

    update(entity:Platform):Observable<Platform>{
        let requestUrl = `${this.uesPlayApi}/${entity.platformId}`;

        return this.http.post<Platform>(
            `${requestUrl}`,
            entity
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }

    delete(entity:Platform):Observable<any>{
        let requestUrl = `${this.uesPlayApi}/${entity.platformId}`;

        return this.http.delete<any>(
            `${requestUrl}`
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }

    summary():Observable<Summary>{
        let requestUrl = `${this.uesPlayApi}/summary`;

        return this.http.get<Summary>(
            `${requestUrl}`
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }

    private handleErrors(error: HttpErrorResponse): Observable<never>  {
        return throwError(()=>error.error);
    }
}
