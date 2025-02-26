import { inject, PLATFORM_ID } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

export const headersInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId: object = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId) && localStorage.getItem('userToken')) {
    req = req.clone({
      setHeaders: {
        token: localStorage.getItem('userToken') ?? '',
      },
    });
  }

  return next(req);
};
