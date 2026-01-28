import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Filter } from '@shared/interfaces/filter';
import { Envelop } from '@shared/interfaces/envelop';
import { Area } from '@admin/interfaces/area';
import { catchError } from 'rxjs/operators';
import { Author } from '@admin/interfaces/author';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {


    private uesPlayApi =`${environment.UesPlayApi}/admin/resources`;

    constructor(private http:HttpClient) { }

    fetch(resourceId:string,filter:Filter):Observable<Envelop<Author>>{
        let requestUrl = `${this.uesPlayApi}/${resourceId}/authors?page=${filter.page}&pageSize=${filter.pageSize}`;

        return this.http.get<Envelop<Author>>(
            `${requestUrl}`
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }

    create(resourceId:string,request:any):Observable<Author>{
        let requestUrl = `${this.uesPlayApi}/${resourceId}/authors`;

        return this.http.post<Author>(
            `${requestUrl}`,
            request,
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }

    delete(resourceId:string,authorId:string):Observable<any>{
        let requestUrl = `${this.uesPlayApi}/${resourceId}/authors/${authorId}`;

        return this.http.delete<any>(
            `${requestUrl}`
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }

    private handleErrors(error: HttpErrorResponse): Observable<never>  {
        return throwError(()=>error.error);
    }
}
