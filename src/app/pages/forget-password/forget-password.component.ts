import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  imports: [ReactiveFormsModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss',
})
export class ForgetPasswordComponent {
  // Services
  private readonly _authService: AuthService = inject(AuthService);
  private readonly _formBuilder: FormBuilder = inject(FormBuilder);
  private readonly _router: Router = inject(Router);

  // Properties
  isLoading: boolean = false;
  serverErrorMsg: string = '';
  step: number = 1;

  // Forms
  emailForm: FormGroup = this._formBuilder.group({
    email: [null, [Validators.required, Validators.email]],
  });

  resetCodeForm: FormGroup = this._formBuilder.group({
    resetCode: [null, [Validators.required]],
  });

  newPasswordForm: FormGroup = this._formBuilder.group({
    email: [null, [Validators.required, Validators.email]],
    newPassword: [
      null,
      [Validators.required, Validators.pattern(/^[A-Z]\w{7,}$/)],
    ],
  });

  // Methods
  sendEmailForm(): void {
    if (this.emailForm.valid) {
      this.isLoading = true;
      this._authService.forgetPassword(this.emailForm.value.email).subscribe({
        next: (response) => {
          if (response.statusMsg === 'success') {
            this.isLoading = false;
            this.step = 2;
            this.serverErrorMsg = '';
          }
        },
        error: (httpErrorResponse: HttpErrorResponse) => {
          this.isLoading = false;
          this.serverErrorMsg = httpErrorResponse.error.message;
        },
      });
    } else {
      this.emailForm.markAllAsTouched();
    }
  }

  sendRestCodeForm(): void {
    if (this.resetCodeForm.valid) {
      this.isLoading = true;
      this._authService
        .verifyResetCode(this.resetCodeForm.value.resetCode)
        .subscribe({
          next: (response) => {
            if (response.status === 'Success') {
              this.isLoading = false;
              this.step = 3;
              this.serverErrorMsg = '';
              this.newPasswordForm
                .get('email')
                ?.patchValue(this.emailForm.get('email')?.value);
            }
          },
          error: (httpErrorResponse: HttpErrorResponse) => {
            this.isLoading = false;
            this.serverErrorMsg = httpErrorResponse.error.message;
          },
        });
    } else {
      this.resetCodeForm.markAllAsTouched();
    }
  }

  sendNewPasswordForm(): void {
    if (this.newPasswordForm.valid) {
      this.isLoading = true;
      this._authService.resetPassword(this.newPasswordForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.token) this._router.navigate(['login']);
        },
        error: (httpErrorResponse: HttpErrorResponse) => {
          this.isLoading = false;
          this.serverErrorMsg = httpErrorResponse.error.message;
        },
      });
    } else {
      this.newPasswordForm.markAllAsTouched();
    }
  }
}
