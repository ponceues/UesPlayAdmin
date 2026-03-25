import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

export const sessionGuard: CanActivateFn = (_route, _state) => {
  const router = inject(Router);
  const token = localStorage.getItem('authJwt');

  if (!token) {
    localStorage.clear();
    router.navigate(['/auth/login']);
    return false;
  }

  try {
    const decodedToken: any = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);

    if (decodedToken.exp && decodedToken.exp < currentTime) {
      localStorage.clear();
      router.navigate(['/auth/login']);
      return false;
    }
    return true;
  } catch (error) {
    localStorage.clear();
    router.navigate(['/auth/login']);
    return false;
  }
};
