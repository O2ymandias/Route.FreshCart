import { Component, inject, OnDestroy } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnDestroy {
  // Services
  private readonly _authService: AuthService = inject(AuthService);
  private readonly _router: Router = inject(Router);

  // Properties
  isLoading: boolean = false;
  loginForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required]),
  });

  // Subscriptions
  loginUserSubscription: Subscription | null = null;

  // Methods
  login(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.loginUserSubscription = this._authService
        .loginUser(this.loginForm.value)
        .subscribe({
          next: (response: any) => {
            if (response.message === 'success') {
              // Handle UI
              this.isLoading = false;

              // Authenticate User
              localStorage.setItem('userToken', response.token);
              this._authService.isLoggedIn.next(true);
              const userData = this._authService.decodeToken(response.token);
              if (userData !== null) {
                this._authService.userName.next(userData.name);
              }

              this._router.navigate(['/home']);
            }
          },
          error: () => {
            this.isLoading = false;
          },
        });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  ngOnDestroy(): void {
    this.loginUserSubscription?.unsubscribe();
  }
}
