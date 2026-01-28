import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Filter } from '@shared/interfaces/filter';
import { Observable, throwError } from 'rxjs';
import { Envelop } from '@shared/interfaces/envelop';
import { User } from '@admin/interfaces/user';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

    private uesPlayUrl: string = `${environment.UesPlayApi}/admin/users`;
    private http: HttpClient = inject(HttpClient);

    constructor() { }

    fetch(filter:Filter):Observable<Envelop<User>>{
        let requestUrl = `${this.uesPlayUrl}?page=${filter.page}&pageSize=${filter.pageSize}`;

        if(filter.state != null){
            requestUrl += `&stateId=${filter.state}`;
        }

        if(filter.text != null){
            requestUrl += `&text=${filter.text}`;
        }

        return this.http.get<Envelop<User>>(
            `${requestUrl}`
            ).pipe(
                catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
            );
    }

    create(request:any):Observable<User>{
        let requestUrl = `${this.uesPlayUrl}`;

        return this.http.post<User>(
            `${requestUrl}`,
            request
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }

    update(user:User):Observable<User>{
        let requestUrl = `${this.uesPlayUrl}/${user.userId}`;

        return this.http.post<User>(
            `${requestUrl}`,
            user
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }

    downloadTemplate():Observable<Blob>{
        let requestUrl = `${this.uesPlayUrl}/bulkUpload`;

        return this.http.get(requestUrl, { responseType: 'blob' });
    }

    uploadBulk(areaId:string, rolId:string, file:any):Observable<any>{
        let formData = new FormData();
        formData.append('areaId', areaId);
        formData.append('rolId', rolId);
        formData.append('file', file);
        let requestUrl = `${this.uesPlayUrl}/bulkUpload`;

        return this.http.post(requestUrl,formData);
    }

    private handleErrors(error: HttpErrorResponse): Observable<never>  {
        return throwError(()=>error.error);
    }
}
