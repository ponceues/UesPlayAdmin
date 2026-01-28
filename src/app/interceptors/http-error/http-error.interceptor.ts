import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';


export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
    const messageService: MessageService = inject(MessageService);

    return next(req).pipe(
        catchError((error:HttpErrorResponse) => {
            let message = error.error.message;;
            let title = '';
            let severity: 'error' | 'warn' | 'info';

            switch (error.error.code) {
                case 400:
                    title = 'Solicitud incorrecta';
                    severity = 'warn';
                    break;
                case 401:
                case 403:
                    title = 'Permisos insuficientes';
                    severity = 'error';
                    break;
                case 404:
                    title = 'Recurso no encontrado';
                    severity = 'warn';
                    break;
                case 500:
                default:
                    title = 'Ha ocurrido un error';
                    message = 'Por favor, intente nuevamente más tarde.';
                    severity = 'error';
                    break;
            }

            messageService.add({
                severity: severity,
                summary: title,
                detail: message,
                key:'main'
            });

            return throwError(() => error);

        })

   );
};
