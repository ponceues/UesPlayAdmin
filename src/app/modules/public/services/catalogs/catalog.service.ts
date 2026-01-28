import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Filter } from '@shared/interfaces/filter';
import { Observable, throwError } from 'rxjs';
import { Envelop } from '@shared/interfaces/envelop';
import { Device } from '@public/interfaces/device';
import { catchError } from 'rxjs/operators';
import { MediaType } from '@public/interfaces/media-type';
import { MediaGenre } from '@public/interfaces/media-genre';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
    private http:HttpClient = inject(HttpClient);
    private uesPlayApi =`${environment.UesPlayApi}/uesplay/catalogs`;

    constructor() { }

    fetchMediaTypes(filter:Filter):Observable<Envelop<MediaType>>{
        let requestUrl = `${this.uesPlayApi}/media-types?page=${filter.page}&pageSize=${filter.pageSize}`;

        return this.http.get<Envelop<MediaType>>(
            `${requestUrl}`
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }

    fetchMediaGenres(filter:Filter):Observable<Envelop<MediaGenre>>{
        let requestUrl = `${this.uesPlayApi}/media-genres?page=${filter.page}&pageSize=${filter.pageSize}`;

        return this.http.get<Envelop<MediaGenre>>(
            `${requestUrl}`
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }

    private handleErrors(error: HttpErrorResponse): Observable<never>  {
        return throwError(()=>error.error);
    }
}
