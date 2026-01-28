import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import {Observable,throwError} from 'rxjs';
import {HttpClient,HttpErrorResponse} from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

import { Filter } from '@shared/interfaces/filter';
import { Envelop } from '@shared/interfaces/envelop';
import { Area } from '@admin/interfaces/area';

@Injectable({
  providedIn: 'root'
})
export class AreasService {

    private uesPlayApi =`${environment.UesPlayApi}/admin/resource-areas`;

    constructor(private http:HttpClient) { }

    fetch(filter:Filter):Observable<Envelop<Area>>{
        let requestUrl = `${this.uesPlayApi}?page=${filter.page}&pageSize=${filter.pageSize}`;

        if(filter.text !== null){
            requestUrl = `${requestUrl}&text=${filter.text}`;
        }

        if(filter.state !== null){
            requestUrl = `${requestUrl}&available=${filter.state}`;
        }

        return this.http.get<Envelop<Area>>(
            `${requestUrl}`
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }

    create(request:any):Observable<Area>{
        let requestUrl = `${this.uesPlayApi}`;

        return this.http.post<Area>(
            requestUrl,
            request
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }

    update(area:Area):Observable<Area>{
        let requestUrl = `${this.uesPlayApi}/${area.areaId}`;

        return this.http.post<Area>(
            requestUrl,
            area
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }

    delete(area:Area):Observable<any>{
        let requestUrl = `${this.uesPlayApi}/${area.areaId}`;

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
