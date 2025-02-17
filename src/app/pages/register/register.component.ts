import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnDestroy {
  // Services
  private readonly _authService: AuthService = inject(AuthService);
  private readonly _router: Router = inject(Router);
  private readonly _formBuilder: FormBuilder = inject(FormBuilder);

  // Properties
  @ViewChild('countdown')
  countDown!: ElementRef<HTMLElement>;
  countDownInterval!: NodeJS.Timeout;
  goToLoginAfter: number = 5;
  isLoading: boolean = false;
  isRegisteredSuccessfully: boolean = false;
  serverErrorMsg: string = '';
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
    clearInterval(this.countDownInterval);
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
            this.isLoading = false;
            this.isRegisteredSuccessfully = true;
            this.countDownInterval = this._countDown();

            setTimeout(() => {
              clearInterval(this.countDownInterval);
              this._router.navigate(['login']);
            }, this.goToLoginAfter * 1000);
          },
          error: (httpErrorResponse: HttpErrorResponse) => {
            this.serverErrorMsg = httpErrorResponse.error.message;
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
  _countDown(): NodeJS.Timeout {
    return setInterval(() => {
      this.goToLoginAfter--;
    }, 1000);
  }
}
