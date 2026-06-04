import { inject, Injectable } from '@angular/core';
import { environment} from '../../../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Filter } from '@shared/interfaces/filter';
import { Envelop } from '@shared/interfaces/envelop';
import { Platform } from '../../interfaces/platform';


@Injectable({
  providedIn: 'root'
})
export class PlatformService {
    private http:HttpClient = inject(HttpClient);
    private uesPlayApi:string =`${environment.UesPlayApi}/platforms`;

    constructor() { }

    fetchByFilter(filter:Filter):Observable<Envelop<Platform>>{
        let requestUrl = `${this.uesPlayApi}?page=${filter.page}&pageSize=${filter.pageSize}`;

        return this.http.get<Envelop<Platform>>(
            `${requestUrl}`
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }

    private handleErrors(error: HttpErrorResponse): Observable<never>  {
        return throwError(()=>error.error);
    }
}
