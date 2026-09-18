import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {

  const router = inject(Router);

  const isLoggedIn = localStorage.getItem('adminLoggedIn');

  if (isLoggedIn === 'true') {
    return true;
  }

  return router.createUrlTree(['/admin/login']);

};