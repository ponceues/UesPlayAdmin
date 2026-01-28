import { inject, Injectable } from '@angular/core';
import { environment} from '../../../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Filter } from '@shared/interfaces/filter';
import { Envelop } from '@shared/interfaces/envelop';
import { ResourceType } from '../../interfaces/resource-type';

@Injectable({
  providedIn: 'root'
})

export class ResourceTypeService {
    private http:HttpClient = inject(HttpClient);
    private uesPlayApi =`${environment.UesPlayApi}/admin/resource/types`;

    constructor() { }

    fetchByFilter(filter:Filter):Observable<Envelop<ResourceType>>{
        let requestUrl = `${this.uesPlayApi}?page=${filter.page}&pageSize=${filter.pageSize}`;

        return this.http.get<Envelop<ResourceType>>(
            `${requestUrl}`
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }

    private handleErrors(error: HttpErrorResponse): Observable<never>  {
        return throwError(()=>error.error);
    }
}
