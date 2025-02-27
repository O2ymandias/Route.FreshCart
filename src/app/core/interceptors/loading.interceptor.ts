import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const ngxSpinnerService: NgxSpinnerService = inject(NgxSpinnerService);
  ngxSpinnerService.show();

  return next(req).pipe(
    finalize(() => setTimeout(() => ngxSpinnerService.hide(), 500)),
  );
};
