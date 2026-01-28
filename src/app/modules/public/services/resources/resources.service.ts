import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Filter } from '@shared/interfaces/filter';
import { Observable, throwError } from 'rxjs';
import { Envelop } from '@shared/interfaces/envelop';
import { Resource } from '@public/interfaces/resource';
import { catchError } from 'rxjs/operators';
import { Comment } from '@public/interfaces/comment';

@Injectable({
  providedIn: 'root'
})
export class ResourcesService {
    private uesPlayApi =`${environment.UesPlayApi}/resources`;

    constructor(private http:HttpClient) { }

    search(filter:Filter):Observable<Envelop<Resource>>{
        let requestUrl = `${this.uesPlayApi}?page=${filter.page}&pageSize=${filter.pageSize}`;

        if(filter.typeId !== null){
            requestUrl = `${requestUrl}&typeId=${filter.typeId}`;
        }

        if(filter.platformId !== null){
            requestUrl = `${requestUrl}&platformId=${filter.platformId}`;
        }

        if(filter.deviceId !== null){
            requestUrl = `${requestUrl}&deviceId=${filter.deviceId}`;
        }

        return this.http.get<Envelop<Resource>>(
            `${requestUrl}`
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

    downloadVersion(resourceId: string, versionId: string): Observable<Blob> {
        const timestamp = new Date().getTime();
        const requestUrl = `${this.uesPlayApi}/${resourceId}/versions/${versionId}/download?t=${timestamp}`;
        return this.http.get(requestUrl, {
            responseType: 'blob',
            headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        }).pipe(
            catchError((err: HttpErrorResponse) => this.handleErrors(err))
        );
    }

    searchComments(filter:Filter, resourceId:string):Observable<Envelop<Comment>>{
        let requestUrl = `${this.uesPlayApi}/${resourceId}/comments?page=${filter.page}&pageSize=${filter.pageSize}`;

        return this.http.get<Envelop<Comment>>(
            `${requestUrl}`
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }

    createComment(request:any, resourceId:string):Observable<Comment>{
        let requestUrl = `${this.uesPlayApi}/${resourceId}/comments`;

        return this.http.post<Comment>(
            `${requestUrl}`,
            request
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }

    private handleErrors(error: HttpErrorResponse): Observable<never>  {
        return throwError(()=>error.error);
    }
}
