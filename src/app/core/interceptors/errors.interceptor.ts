import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

export const errorsInterceptor: HttpInterceptorFn = (req, next) => {
  const _toastrService: ToastrService = inject(ToastrService);

  return next(req).pipe(
    catchError((err) => {
      _toastrService.error(err.error.message, 'FreshCart');
      return throwError(() => err);
    }),
  );
};
