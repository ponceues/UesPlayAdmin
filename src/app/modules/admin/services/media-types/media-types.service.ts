import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import {Observable,throwError} from 'rxjs';
import {HttpClient,HttpErrorResponse} from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

import { Filter } from '@shared/interfaces/filter';
import { Envelop } from '@shared/interfaces/envelop';
import { MediaType } from '@admin/interfaces/media-type';

@Injectable({
  providedIn: 'root'
})

export class MediaTypesService {

    private uesPlayApi =`${environment.UesPlayApi}/admin/mediatypes`;

    constructor(private http:HttpClient) { }

    fetch(filter:Filter):Observable<Envelop<MediaType>>{
        let requestUrl = `${this.uesPlayApi}?page=${filter.page}&pageSize=${filter.pageSize}`;

        if(filter.text !== null){
            requestUrl = `${requestUrl}&text=${filter.text}`;
        }

        if(filter.enabled !== null){
            requestUrl = `${requestUrl}&enabled=${filter.enabled}`;
        }

        return this.http.get<Envelop<MediaType>>(
            `${requestUrl}`
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }

    find(mediaTypeId:string):Observable<MediaType>{
        let requestUrl = `${this.uesPlayApi}/${mediaTypeId}`;

        return this.http.get<MediaType>(
            `${requestUrl}`
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }

    create(request:any):Observable<MediaType>{
        let requestUrl = `${this.uesPlayApi}`;

        return this.http.post<MediaType>(
            requestUrl,
            request
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }

    update(entity:MediaType):Observable<MediaType>{
        let requestUrl = `${this.uesPlayApi}/${entity.typeId}`;

        return this.http.post<MediaType>(
            requestUrl,
            entity
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }

    delete(entity:MediaType):Observable<any>{
        let requestUrl = `${this.uesPlayApi}/${entity.typeId}`;

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
