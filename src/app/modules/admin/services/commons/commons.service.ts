import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Filter } from '@shared/interfaces/filter';
import { Observable, throwError } from 'rxjs';
import { Envelop } from '@shared/interfaces/envelop';

import { catchError } from 'rxjs/operators';
import { Area } from '@admin/interfaces/area';
import { License } from '@admin/interfaces/license';
import { Platform } from '@admin/interfaces/platform';
import { Device } from '@admin/interfaces/device';
import { Language } from '@admin/interfaces/language';
import { Rol } from '@admin/interfaces/rol';
import { UserState } from '@admin/interfaces/user-state';

@Injectable({
    providedIn: 'root'
})
export class CommonsService {
    private http: HttpClient = inject(HttpClient);
    private uesPlayApi = `${environment.UesPlayApi}/admin`;

    listAreas(filter: Filter): Observable<Envelop<Area>> {
        let requestUrl = `${this.uesPlayApi}/available-areas?page=${filter.page}&pageSize=${filter.pageSize}`;

        if (filter.text !== null) {
            requestUrl = `${requestUrl}&text=${filter.text}`;
        }

        if (filter.state !== null) {
            requestUrl = `${requestUrl}&available=${filter.state}`;
        }

        return this.http.get<Envelop<Area>>(`${requestUrl}`).pipe(
            catchError((err: HttpErrorResponse) => {
                return this.handleErrors(err);
            })
        );
    }

    listRoles(filter: Filter): Observable<Envelop<Rol>> {
        let requestUrl = `${this.uesPlayApi}/available-roles?page=${filter.page}&pageSize=${filter.pageSize}`;

        if (filter.text !== null) {
            requestUrl = `${requestUrl}&text=${filter.text}`;
        }

        if (filter.state !== null) {
            requestUrl = `${requestUrl}&available=${filter.state}`;
        }

        return this.http.get<Envelop<Rol>>(`${requestUrl}`).pipe(
            catchError((err: HttpErrorResponse) => {
                return this.handleErrors(err);
            })
        );
    }

    listLicences(filter: Filter): Observable<Envelop<License>> {
        let requestUrl = `${this.uesPlayApi}/available-licenses?page=${filter.page}&pageSize=${filter.pageSize}`;

        if (filter.text !== null) {
            requestUrl = `${requestUrl}&text=${filter.text}`;
        }

        if (filter.state !== null) {
            requestUrl = `${requestUrl}&available=${filter.state}`;
        }

        return this.http.get<Envelop<License>>(`${requestUrl}`).pipe(
            catchError((err: HttpErrorResponse) => {
                return this.handleErrors(err);
            })
        );
    }

    listPlatforms(filter: Filter): Observable<Envelop<Platform>> {
        let requestUrl = `${this.uesPlayApi}/available-platforms?page=${filter.page}&pageSize=${filter.pageSize}`;

        if (filter.text !== null) {
            requestUrl = `${requestUrl}&text=${filter.text}`;
        }

        if (filter.state !== null) {
            requestUrl = `${requestUrl}&available=${filter.state}`;
        }

        return this.http.get<Envelop<Platform>>(`${requestUrl}`).pipe(
            catchError((err: HttpErrorResponse) => {
                return this.handleErrors(err);
            })
        );
    }

    listDevices(filter: Filter): Observable<Envelop<Device>> {
        let requestUrl = `${this.uesPlayApi}/available-devices?page=${filter.page}&pageSize=${filter.pageSize}`;

        if (filter.text !== null) {
            requestUrl = `${requestUrl}&text=${filter.text}`;
        }

        if (filter.state !== null) {
            requestUrl = `${requestUrl}&available=${filter.state}`;
        }

        return this.http.get<Envelop<Device>>(`${requestUrl}`).pipe(
            catchError((err: HttpErrorResponse) => {
                return this.handleErrors(err);
            })
        );
    }

    listLanguages(filter: Filter): Observable<Envelop<Language>> {
        let requestUrl = `${this.uesPlayApi}/available-languages?page=${filter.page}&pageSize=${filter.pageSize}`;

        if (filter.text !== null) {
            requestUrl = `${requestUrl}&text=${filter.text}`;
        }

        if (filter.state !== null) {
            requestUrl = `${requestUrl}&available=${filter.state}`;
        }

        return this.http.get<Envelop<Language>>(`${requestUrl}`).pipe(
            catchError((err: HttpErrorResponse) => {
                return this.handleErrors(err);
            })
        );
    }
    listUsersStates(filter: Filter): Observable<Envelop<UserState>> {
        let requestUrl = `${this.uesPlayApi}/available-userstates?page=${filter.page}&pageSize=${filter.pageSize}`;

        if (filter.text !== null) {
            requestUrl = `${requestUrl}&text=${filter.text}`;
        }

        if (filter.state !== null) {
            requestUrl = `${requestUrl}&available=${filter.state}`;
        }

        return this.http.get<Envelop<UserState>>(`${requestUrl}`).pipe(
            catchError((err: HttpErrorResponse) => {
                return this.handleErrors(err);
            })
        );
    }

    private handleErrors(error: HttpErrorResponse): Observable<never> {
        return throwError(() => error.error);
    }
}
