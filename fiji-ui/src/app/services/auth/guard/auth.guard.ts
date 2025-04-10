import {CanActivateFn, Router} from '@angular/router';
import {TokenService} from '../token/token.service';
import {inject} from '@angular/core';

export const authGuard: CanActivateFn = () => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  
  // If token is NOT valid, redirect to login
  if (!tokenService.isTokenValid()) {
    router.navigate(['auth/login']);
    return false;
  }
  
  // If token is valid, allow access
  return true;
};
