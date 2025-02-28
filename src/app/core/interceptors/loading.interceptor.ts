import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const ngxSpinnerService: NgxSpinnerService = inject(NgxSpinnerService);
  console.log(req.url);
  if (
    (req.url.includes('api/v1/cart') &&
      (req.method === 'POST' ||
        req.method === 'DELETE' ||
        req.method === 'PUT')) ||
    (req.url.includes('api/v1/wishlist') &&
      (req.method === 'POST' || req.method === 'DELETE'))
  ) {
    return next(req);
  } else {
    ngxSpinnerService.show();
    return next(req).pipe(
      finalize(() => setTimeout(() => ngxSpinnerService.hide(), 500)),
    );
  }
};
