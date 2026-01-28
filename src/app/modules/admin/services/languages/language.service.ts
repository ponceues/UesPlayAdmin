import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Filter } from '@shared/interfaces/filter';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Language } from '@admin/interfaces/language';
import { Envelop } from '@shared/interfaces/envelop';
@Injectable({
  providedIn: 'root'
})
export class LanguageService {
    private uesPlayApi =`${environment.UesPlayApi}/uesplay/catalogs`;

    constructor(private http:HttpClient) { }

    fetch(filter:Filter):Observable<Envelop<Language>>{
        let requestUrl = `${this.uesPlayApi}/languages`;

        return this.http.get<Envelop<Language>>(
            `${requestUrl}`
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }

    private handleErrors(error: HttpErrorResponse): Observable<never>  {
        return throwError(()=>error.error);
    }
}
