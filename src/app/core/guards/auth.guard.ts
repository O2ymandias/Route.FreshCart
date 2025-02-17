import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const platformId: Object = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    if (localStorage.getItem('userToken')) {
      router.navigate(['/home']);
      return false; // If user has token,  Don't Activate authLayout
    }
    return true;
  }
  return false;
};
