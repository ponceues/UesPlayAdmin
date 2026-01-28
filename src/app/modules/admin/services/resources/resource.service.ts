import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Filter } from '@shared/interfaces/filter';
import { Envelop } from '@shared/interfaces/envelop';
import { Resource } from '@admin/interfaces/resource';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

    private uesPlayApi =`${environment.UesPlayApi}/admin/resources`;

    constructor(private http:HttpClient) { }

    fetch(filter:Filter):Observable<Envelop<Resource>>{
        let requestUrl = `${this.uesPlayApi}?page=${filter.page}&pageSize=${filter.pageSize}`;

        if(filter.text !== null){
            requestUrl = `${requestUrl}&text=${filter.text}`;
        }

        if(filter.stateId !== null){
            requestUrl = `${requestUrl}&stateId=${filter.stateId}`;
        }

        if(filter.areaId !== null){
            requestUrl = `${requestUrl}&areaId=${filter.areaId}`;
        }

        return this.http.get<Envelop<Resource>>(
            `${requestUrl}`
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }

    create(request:any):Observable<Resource>{
        let requestUrl = `${this.uesPlayApi}`;

        return this.http.post<Resource>(
            `${requestUrl}`,
            request
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }

    find(Id: string):Observable<Resource>{
        let requestUrl = `${this.uesPlayApi}`;

        return this.http.get<Resource>(
            `${requestUrl}/${Id}`,
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }

    update(entity: Resource):Observable<Resource>{
        let requestUrl = `${this.uesPlayApi}`;

        return this.http.post<Resource>(
            `${requestUrl}/${entity.resourceId}`,
            entity
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }

    updateState(entity: Resource):Observable<Resource>{
        let requestUrl = `${this.uesPlayApi}/${entity.resourceId}`;

        return this.http.put<Resource>(
            requestUrl,
            entity
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }

    private handleErrors(error: HttpErrorResponse): Observable<never>  {
        return throwError(()=>error.error);
    }
}
