import { HttpInterceptorFn } from '@angular/common/http';

export const tokenJwtInterceptor: HttpInterceptorFn = (req, next) => {
    const excludedUrls = ['/auth/login'];
    const shouldExclude = excludedUrls.some(url => req.url.includes(url));

    if (shouldExclude) {
        return next(req);
    }

    const token = localStorage.getItem('authJwt');
    if(!token) {
        console.log("token null " + req.url);
        return next(req);
    }
    let jwt = JSON.parse(token);

    const authReq = req.clone({
        setHeaders: {
            Authorization: `Bearer ${jwt.token}`
        }
    });

    return next(authReq);
};
