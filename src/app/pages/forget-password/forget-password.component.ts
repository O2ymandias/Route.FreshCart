import { Component, inject, OnDestroy } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-forget-password',
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss',
})
export class ForgetPasswordComponent implements OnDestroy {
  // Services
  private readonly _authService: AuthService = inject(AuthService);
  private readonly _formBuilder: FormBuilder = inject(FormBuilder);
  private readonly _router: Router = inject(Router);

  // Properties
  isLoading: boolean = false;
  step: number = 1;

  // Subscriptions
  forgetPasswordSubscription: Subscription | null = null;
  verifyResetCodeSubscription: Subscription | null = null;
  resetPasswordSubscription: Subscription | null = null;

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
      this.forgetPasswordSubscription = this._authService
        .forgetPassword(this.emailForm.value.email)
        .subscribe({
          next: (response) => {
            if (response.statusMsg === 'success') {
              this.isLoading = false;
              this.step = 2;
            }
          },
        });
    } else {
      this.emailForm.markAllAsTouched();
    }
  }

  sendRestCodeForm(): void {
    if (this.resetCodeForm.valid) {
      this.isLoading = true;
      this.verifyResetCodeSubscription = this._authService
        .verifyResetCode(this.resetCodeForm.value.resetCode)
        .subscribe({
          next: (response) => {
            if (response.status === 'Success') {
              this.isLoading = false;
              this.step = 3;
              this.newPasswordForm
                .get('email')
                ?.patchValue(this.emailForm.get('email')?.value);
            }
          },
          error: () => {
            this.isLoading = false;
          },
        });
    } else {
      this.resetCodeForm.markAllAsTouched();
    }
  }

  sendNewPasswordForm(): void {
    if (this.newPasswordForm.valid) {
      this.isLoading = true;
      this.resetPasswordSubscription = this._authService
        .resetPassword(this.newPasswordForm.value)
        .subscribe({
          next: (response) => {
            this.isLoading = false;
            if (response.token) this._router.navigate(['login']);
          },
          error: () => {
            this.isLoading = false;
          },
        });
    } else {
      this.newPasswordForm.markAllAsTouched();
    }
  }

  ngOnDestroy(): void {
    this.forgetPasswordSubscription?.unsubscribe();
    this.verifyResetCodeSubscription?.unsubscribe();
    this.resetPasswordSubscription?.unsubscribe();
  }
}
