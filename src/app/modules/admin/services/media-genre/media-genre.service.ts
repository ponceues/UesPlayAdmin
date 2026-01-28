import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { filter, Observable, throwError } from 'rxjs';
import {HttpClient,HttpErrorResponse} from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

import { Filter } from '@shared/interfaces/filter';
import { Envelop } from '@shared/interfaces/envelop';
import { MediaGenre } from '@admin/interfaces/media-genre';

@Injectable({
  providedIn: 'root'
})
export class MediaGenreService {

    private uesPlayApi =`${environment.UesPlayApi}/admin/mediatypes`;

    constructor(private http:HttpClient) { }

    fetch(filter:Filter, typeId:string):Observable<Envelop<MediaGenre>>{
        let requestUrl = `${this.uesPlayApi}/${typeId}/genres?page=${filter.page}&pageSize=${filter.pageSize}`;


        if(filter.text !== null){
            requestUrl = `${requestUrl}&text=${filter.text}`;
        }

        if(filter.enabled !== null){
            requestUrl = `${requestUrl}&enabled=${filter.enabled}`;
        }

        return this.http.get<Envelop<MediaGenre>>(
            `${requestUrl}`
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }

    create(request:any, typeId: string):Observable<MediaGenre>{
        let requestUrl = `${this.uesPlayApi}/${typeId}/genres`;

        return this.http.post<MediaGenre>(
            requestUrl,
            request
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }

    update(entity:MediaGenre, typeId:string):Observable<MediaGenre>{
        let requestUrl = `${this.uesPlayApi}/${typeId}/genres/${entity.genreId}`;

        return this.http.post<MediaGenre>(
            requestUrl,
            entity
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }

    delete(entity:MediaGenre, typeId:string):Observable<any>{
        let requestUrl = `${this.uesPlayApi}/${typeId}/genres/${entity.genreId}`;

        return this.http.delete<any>(
            requestUrl
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }

    private handleErrors(error: HttpErrorResponse): Observable<never>  {
        return throwError(()=>error.error);
    }
}
