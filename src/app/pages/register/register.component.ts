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
import { TranslatePipe } from '@ngx-translate/core';
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

  // Properties
  @ViewChild('countdown')
  isLoading: boolean = false;
  registerUserSubscription!: Subscription;
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

  // Hooks

  ngOnDestroy(): void {
    this.registerUserSubscription?.unsubscribe();
  }

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
              this._toastrService.success(
                'Registered successfully',
                'FreshCart',
              );

              setTimeout(() => {
                this._router.navigate(['login']);
              }, 500);
            }
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
}
