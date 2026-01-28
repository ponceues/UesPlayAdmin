import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Filter } from '@shared/interfaces/filter';
import { Observable, throwError } from 'rxjs';
import { Envelop } from '@shared/interfaces/envelop';
import { catchError } from 'rxjs/operators';
import { Comment } from '@admin/interfaces/comment';

@Injectable({
  providedIn: 'root'
})

export class CommentService {
    private http:HttpClient = inject(HttpClient);
    private uesPlayApi =`${environment.UesPlayApi}/admin/resources`;


    search(filter:Filter, resourceId:string):Observable<Envelop<Comment>>{
        let requestUrl = `${this.uesPlayApi}/${resourceId}/comments?page=${filter.page}&pageSize=${filter.pageSize}`;

        return this.http.get<Envelop<Comment>>(
            `${requestUrl}`
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }

    update(comment: Comment, resourceId: string):Observable<Comment>{
        let requestUrl = `${this.uesPlayApi}/${resourceId}/comments/${comment.commentId}`;

        return this.http.post<Comment>(
            `${requestUrl}`,
            comment
        ).pipe(
            catchError((err: HttpErrorResponse) => {return this.handleErrors(err)})
        );
    }

    private handleErrors(error: HttpErrorResponse): Observable<never>  {
        return throwError(()=>error.error);
    }
}
