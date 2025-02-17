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
import { IUserData } from '../../shared/interfaces/iuser-data';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnDestroy {
  // Services
  private readonly _authService: AuthService = inject(AuthService);
  private readonly _router: Router = inject(Router);

  // Properties
  loginUserSubscription!: Subscription;
  isLoggedInSuccessfully: boolean = false;
  serverErrorMsg: string = '';
  isLoading: boolean = false;
  loginForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required]),
  });

  // Hooks
  ngOnDestroy(): void {
    this.loginUserSubscription?.unsubscribe();
  }

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
              this.isLoggedInSuccessfully = true;

              // Authenticate User
              localStorage.setItem('userToken', response.token);
              this._authService.isLoggedIn.next(true);
              const userData = this._authService.decodeToken(response.token);
              if (userData !== null) {
                console.log(userData.name);
                this._authService.userName.next(userData.name);
              }

              this._router.navigate(['/home']);
            }
          },
          error: (httpErrorResponse: HttpErrorResponse) => {
            this.isLoading = false;
            this.serverErrorMsg =
              httpErrorResponse.status === 401
                ? httpErrorResponse.error.message
                : 'Pleas enter valid data.';
          },
        });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
