import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IRegisterUser } from '../../shared/interfaces/iregister-user';
import { ILoginUser } from '../../shared/interfaces/ilogin-user';
import { environment } from '../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { IUserData } from '../../shared/interfaces/iuser-data';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { IResetPassword } from '../../shared/interfaces/ireset-password';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);
  userName: BehaviorSubject<string> = new BehaviorSubject('');

  constructor(
    private readonly _httpClient: HttpClient,
    private readonly _router: Router,
    @Inject(PLATFORM_ID) private readonly _platformId: Object,
  ) {
    if (isPlatformBrowser(this._platformId)) {
      if (localStorage.getItem('userToken')) {
        this.isLoggedIn.next(true);
        const token: string = localStorage.getItem('userToken')!;
        const userData = this.decodeToken(token);
        if (userData !== null) this.userName.next(userData.name);
      }
    }
  }

  registerUser(user: IRegisterUser): Observable<any> {
    return this._httpClient.post(
      `${environment.baseUrl}/api/v1/auth/signup`,
      user,
    );
  }

  loginUser(user: ILoginUser) {
    return this._httpClient.post(
      `${environment.baseUrl}/api/v1/auth/signin`,
      user,
    );
  }

  decodeToken(token: string): IUserData | null {
    return jwtDecode(token);
  }

  verifyToken(token: string): Observable<any> {
    return this._httpClient.get(
      'https://ecommerce.routemisr.com/api/v1/auth/verifyToken',
      {
        headers: {
          token,
        },
      },
    );
  }

  signOut(): void {
    localStorage.removeItem('userToken');
    this.isLoggedIn.next(false);
    this.userName.next('');
    this._router.navigate(['login']);
  }

  forgetPassword(email: string): Observable<any> {
    return this._httpClient.post(
      `${environment.baseUrl}/api/v1/auth/forgotPasswords`,
      { email },
    );
  }

  verifyResetCode(resetCode: string): Observable<any> {
    return this._httpClient.post(
      `${environment.baseUrl}/api/v1/auth/verifyResetCode`,
      { resetCode },
    );
  }

  resetPassword(data: IResetPassword): Observable<any> {
    return this._httpClient.put(
      `${environment.baseUrl}/api/v1/auth/resetPassword`,
      data,
    );
  }
}
