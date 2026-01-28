import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import {HttpClient,HttpErrorResponse} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Filter } from '@shared/interfaces/filter';
import { Envelop } from '@shared/interfaces/envelop';
import { catchError } from 'rxjs/operators';
import { User } from '@admin/interfaces/user';
import { UserState } from '@admin/interfaces/user-state';

@Injectable({
  providedIn: 'root'
})

export class UserStateService {
    private uesPlayUrl: string = `${environment.UesPlayApi}/admin/user-states`;
    private http: HttpClient = inject(HttpClient);

    constructor() { }

    fetch(filter:Filter):Observable<Envelop<UserState>>{
        let requestUrl = `${this.uesPlayUrl}?page=${filter.page}&pageSize=${filter.pageSize}`;

        return this.http.get<Envelop<UserState>>(
            `${requestUrl}`
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }

    private handleErrors(error: HttpErrorResponse): Observable<never>  {
        return throwError(()=>error.error);
    }
}
