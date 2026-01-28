import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import {Rol} from '../../interfaces/rol';
import {Observable,throwError} from 'rxjs';
import {HttpClient,HttpErrorResponse} from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Menu } from '../../interfaces/menu';
import { Permission} from '../../interfaces/permission';

import { Filter } from '@shared/interfaces/filter';
import { Envelop } from '@shared/interfaces/envelop';
import { Result } from  '@shared/interfaces/result';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

    private uesPlayApi =`${environment.UesPlayApi}/admin/roles`;

    constructor(private http:HttpClient) { }

    addMenu(rol:Rol,menuId:string):Observable<any>{
        let requestUrl:string = `${this.uesPlayApi}/${rol.rolId}/menus/${menuId}`;
        return this.http.post<any>(
            `${requestUrl}`,
                {}
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }

    addPermission(rol:Rol,permission:Permission):Observable<any>{
        let requestUrl:string = `${this.uesPlayApi}/${rol.rolId}/permissions/${permission.permissionId}`;
        return this.http.post<any>(
            `${requestUrl}`,
            {}
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }

    fetch(filter:Filter):Observable<Envelop<Rol>>{
        let requestUrl = `${this.uesPlayApi}?page=${filter.page}&pageSize=${filter.pageSize}`;
        if(filter.available != null){
            requestUrl += `&available=${filter.available}`;
        }


        return this.http.get<Envelop<Rol>>(
            `${requestUrl}`
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }

    create(rol:any):Observable<Rol>{
        let requestUrl:string = `${this.uesPlayApi}`;

        return this.http.post<Rol>(
        `${requestUrl}`,
           rol
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }

    update(rol:Rol):Observable<Rol>{
        let requestUrl:string = `${this.uesPlayApi}/${rol.rolId}`;

        return this.http.put<Rol>(
            `${requestUrl}`,
            rol
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }

    delete(rol:Rol):Observable<Rol>{
        let requestUrl:string = `${this.uesPlayApi}/${rol.rolId}`;

        return this.http.delete<Rol>(
            `${requestUrl}`,
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }

    findById(rolId:string):Observable<Rol>{
        let requestUrl = `${this.uesPlayApi}/${rolId}`;

        return this.http.get<Rol>(
            `${requestUrl}`
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }

    removeMenu(rol:Rol,menu:Menu):Observable<Result>{
        let requestUrl:string = `${this.uesPlayApi}/${rol.rolId}/menus/${menu.menuId}`;
        return this.http.delete<Result>(
            `${requestUrl}`
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }

    removePermission(rol:Rol,permission:Permission):Observable<Result>{
        let requestUrl:string = `${this.uesPlayApi}/${rol.rolId}/permissions/${permission.permissionId}`;
        return this.http.delete<Result>(
            `${requestUrl}`
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }



    private handleErrors(error: HttpErrorResponse): Observable<never>  {
        return throwError(()=>error.error);
    }
}
