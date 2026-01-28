import { Injectable, inject } from '@angular/core';
import { environment} from '../../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Menu } from '../../interfaces/menu';
import { Permission } from '../../interfaces/permission';
import { Filter } from '../../../shared/interfaces/filter';
import { Observable, throwError } from 'rxjs';
import { Envelop } from '../../../shared/interfaces/envelop';
import { Rol } from '../../interfaces/rol';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class MenuService {
    private httpClient:HttpClient = inject(HttpClient);
    private uesPlayApi =`${environment.UesPlayApi}/admin/catalogs/menus`;

    constructor() { }

    fetch(filter:Filter):Observable<Envelop<Menu>>{
        let requestUrl = `${this.uesPlayApi}?page=${filter.page}&pageSize=${filter.pageSize}`;

        return this.httpClient.get<Envelop<Menu>>(
            `${requestUrl}`
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }

    private handleErrors(error: HttpErrorResponse): Observable<never>  {
        return throwError(()=>error.error);
    }
}
