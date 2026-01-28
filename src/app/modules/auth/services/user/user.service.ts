import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../../interfaces/user';

@Injectable({
    providedIn: 'root'
})

export class UserService {

    private uesPlayApi =`${environment.UesPlayApi}/guest/users/register`;

    constructor(private http:HttpClient) { }

    createAccount(request:any):Observable<User>{
        let requestUrl:string = `${this.uesPlayApi}`;

        return this.http.post<User>(
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
