import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Filter } from '@shared/interfaces/filter';
import { Observable, throwError } from 'rxjs';
import { Envelop } from '@shared/interfaces/envelop';
import { Version } from '@admin/interfaces/version';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VersionService {
    private uesPlayApi =`${environment.UesPlayApi}/admin/resources`;

    constructor(private http:HttpClient) { }

    fetch(resourceId:string,filter:Filter):Observable<Envelop<Version>>{
        let requestUrl = `${this.uesPlayApi}/${resourceId}/versions`;

        return this.http.get<Envelop<Version>>(
            `${requestUrl}`
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }

    create(resourceId:string,formData:FormData):Observable<Version>{
        let requestUrl = `${this.uesPlayApi}/${resourceId}/versions`;

        return this.http.post<Version>(
            `${requestUrl}`,
                formData,
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }

    download(resourceId:string, versionId:string):Observable<Blob>{
        let requestUrl = `${this.uesPlayApi}/${resourceId}/versions/${versionId}/download`;

        return this.http.get(
            `${requestUrl}`,
            { responseType: 'blob' }
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }

    private handleErrors(error: HttpErrorResponse): Observable<never>  {
        return throwError(()=>error.error);
    }
}
