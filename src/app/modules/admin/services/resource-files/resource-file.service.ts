import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Filter } from '@shared/interfaces/filter';
import { Observable, throwError } from 'rxjs';
import { Envelop } from '@shared/interfaces/envelop';
import { Platform } from '@admin/interfaces/platform';
import { catchError } from 'rxjs/operators';
import { ResourceFile } from '@admin/interfaces/resource-file';

@Injectable({
  providedIn: 'root'
})
export class ResourceFileService {

    private http:HttpClient = inject(HttpClient);
    private uesPlayApi =`${environment.UesPlayApi}/admin/resources`;


    fetch(resourceId:string,filter:Filter):Observable<Envelop<ResourceFile>>{
        let requestUrl = `${this.uesPlayApi}/${resourceId}/files?page=${filter.page}&pageSize=${filter.pageSize}`;

        return this.http.get<Envelop<ResourceFile>>(
            `${requestUrl}`
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }

    create(resourceId:string,formData:FormData):Observable<ResourceFile>{
        let requestUrl = `${this.uesPlayApi}/${resourceId}/files`;

        return this.http.post<ResourceFile>(
            `${requestUrl}`,
            formData
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }

    delete(resourceId:string, fileId:string):Observable<any>{
        let requestUrl = `${this.uesPlayApi}/${resourceId}/files/${fileId}`;

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
