import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { AuthService } from '@auth/services/auth/auth.service';

let retryCount = 0;
const MAX_RETRY_COUNT = 3;

export const tokenRefreshInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 403) {
                if (retryCount >= MAX_RETRY_COUNT) {
                    console.error('Máximo de reintentos alcanzado. No se puede refrescar el token.');
                    retryCount = 0;
                    return throwError(() => error);
                }

                const authJwtString = localStorage.getItem('authJwt');

                if (!authJwtString) {
                    console.error('No se encontró authJwt en localStorage');
                    retryCount = 0;
                    return throwError(() => error);
                }

                try {
                    const authJwt = JSON.parse(authJwtString);
                    const refreshToken = authJwt.refreshToken;

                    if (!refreshToken) {
                        console.error('No se encontró refreshToken en authJwt');
                        retryCount = 0;
                        return throwError(() => error);
                    }
                    retryCount++;
                    return authService.refreshToken(refreshToken).pipe(
                        switchMap((response: any) => {
                            const updatedAuthJwt = {
                                ...authJwt,
                                token: response.token,
                                refreshToken: response.refreshToken || authJwt.refreshToken
                            };

                            localStorage.setItem('authJwt', JSON.stringify(updatedAuthJwt));

                            retryCount = 0;
                            const clonedReq = req.clone({
                                setHeaders: {
                                    Authorization: `Bearer ${response.token}`
                                }
                            });

                            return next(clonedReq);
                        }),
                        catchError((refreshError) => {
                            console.error('Error al refrescar el token:', refreshError);
                            return throwError(() => error);
                        })
                    );
                } catch (parseError) {
                    console.error('Error al parsear authJwt:', parseError);
                    retryCount = 0;
                    return throwError(() => error);
                }
            }

            return throwError(() => error);
        })
    );
};


