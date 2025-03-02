import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Component, inject, OnDestroy, ViewChild } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnDestroy {
  // Services
  private readonly _authService: AuthService = inject(AuthService);
  private readonly _router: Router = inject(Router);
  private readonly _formBuilder: FormBuilder = inject(FormBuilder);
  private readonly _toastrService: ToastrService = inject(ToastrService);
  private readonly _translateService = inject(TranslateService);

  // Properties
  isLoading: boolean = false;
  registerForm: FormGroup = this._formBuilder.group(
    {
      name: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],

      email: [null, [Validators.required, Validators.email]],
      password: [
        null,
        [Validators.required, Validators.pattern(/^[A-Z]\w{7,}$/)],
      ],

      rePassword: [null, Validators.required],
      phone: [
        null,
        [Validators.required, Validators.pattern(/^01[0125]\d{8}$/)],
      ],
    },
    { validators: [this.confirmPassword] },
  );

  // Subscriptions
  registerUserSubscription: Subscription | null = null;

  // Methods
  register(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.registerUserSubscription = this._authService
        .registerUser(this.registerForm.value)
        .subscribe({
          next: (response) => {
            if (response.message === 'success') {
              this.isLoading = false;
              let message =
                this._translateService.currentLang === 'en'
                  ? 'Registered successfully'
                  : 'تم التسجيل بنجاح';
              this._toastrService.success(message, 'FreshCart');

              setTimeout(() => {
                this._router.navigate(['login']);
              }, 500);
            }
          },
          error: () => {
            this.isLoading = false;
          },
        });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
  confirmPassword(formGroup: AbstractControl): ValidationErrors | null {
    return formGroup.get('password')?.value ===
      formGroup.get('rePassword')?.value
      ? null
      : { mismatch: true };
  }

  ngOnDestroy(): void {
    this.registerUserSubscription?.unsubscribe();
  }
}
