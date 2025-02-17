import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const mainGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const platformId: Object = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    if (localStorage.getItem('userToken'))
      return true; // If user has token, Activate mainLayout.
    else {
      router.navigate(['/login']);
      return false;
    }
  }
  return false;
};
