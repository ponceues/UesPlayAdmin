import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthToken } from '@auth/interfaces/auth-token';

import { catchError } from 'rxjs/operators';
import { AuthUser } from '@auth/interfaces/auth-user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private urlUesPlay =`${environment.UesPlayApi}/auth`;

    constructor(private http:HttpClient) { }

    login(request:any):Observable<AuthToken>{
        let requestUrl:string = `${this.urlUesPlay}/login`;

        return this.http.post<AuthToken>(
            `${requestUrl}`,
            request
            )
            .pipe( catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
            );
    }

    getUserInformation():Observable<AuthUser>{
        let requestUrl:string = `${this.urlUesPlay}/userSettings`;

        return this.http.post<AuthUser>(
            `${requestUrl}`,
            {}
        )
            .pipe( catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
            );
    }

    verifyAccount(request:any):Observable<any>{
        let requestUrl:string = `${this.urlUesPlay}/verifyaccount`;

        return this.http.post<AuthToken>(
            `${requestUrl}`,
            request
        ).pipe( catchError((err: HttpErrorResponse) => {return this.handleErrors(err)}) );
    }

    sendResetPasswordRequest(request:any):Observable<any>{
        let requestUrl: string = `${this.urlUesPlay}/recoveryrequest`;

        return this.http.post<any>(
            `${requestUrl}`,
            request
        ).pipe( catchError((err: HttpErrorResponse) => {return this.handleErrors(err)}) );
    }

    resetPassword(request:any):Observable<any>{
        let requestUrl: string = `${this.urlUesPlay}/reset-password`;

        return this.http.post<any>(
            `${requestUrl}`,
            request
        ).pipe( catchError((err: HttpErrorResponse) => {return this.handleErrors(err)}) );
    }

    refreshToken(refreshToken: string): Observable<AuthToken> {
        let requestUrl: string = `${this.urlUesPlay}/refresh`;

        return this.http.post<AuthToken>(
            `${requestUrl}`,
            { refresh_token: refreshToken }
        ).pipe(
            catchError((err: HttpErrorResponse) => {
                return this.handleErrors(err);
            })
        );
    }

    private handleErrors(error: HttpErrorResponse): Observable<never>  {
        return throwError(()=>error.error);
    }
}
