import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Filter } from '@shared/interfaces/filter';
import { Observable, throwError } from 'rxjs';
import { Envelop } from '@shared/interfaces/envelop';
import { catchError } from 'rxjs/operators';

import { Device } from '@admin/interfaces/device';
import { Summary } from '@admin/interfaces/sumary';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
    private http:HttpClient = inject(HttpClient);
    private uesPlayApi =`${environment.UesPlayApi}/admin/devices`;


    fetch(filter:Filter):Observable<Envelop<Device>>{
        let requestUrl = `${this.uesPlayApi}?page=${filter.page}&pageSize=${filter.pageSize}`;

        if(filter.text != null){
            requestUrl = `${requestUrl}&text=${filter.text}`;
        }
        if(filter.state != null){
            requestUrl = `${requestUrl}&available=${filter.state}`;
        }

        return this.http.get<Envelop<Device>>(
            `${requestUrl}`
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }

    create(entity:Device):Observable<Device>{
        let requestUrl = `${this.uesPlayApi}`;

        return this.http.post<Device>(
            `${requestUrl}`,
            entity
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }

    update(entity:Device):Observable<Device>{
        let requestUrl = `${this.uesPlayApi}/${entity.deviceId}`;

        return this.http.post<Device>(
            `${requestUrl}`,
            entity
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }

    delete(entity:Device):Observable<any>{
        let requestUrl = `${this.uesPlayApi}/${entity.deviceId}`;

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
