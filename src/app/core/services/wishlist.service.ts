import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  constructor(
    private readonly _httpClient: HttpClient,
    @Inject(PLATFORM_ID) private readonly _platformId: object,
  ) {
    if (
      isPlatformBrowser(this._platformId) &&
      window.localStorage.getItem('userToken')
    ) {
      this.userToken = window.localStorage.getItem('userToken');
    }
  }

  userToken: string | null = null;

  addProductToWishlist(productId: string): Observable<any> {
    return this._httpClient.post(
      `${environment.baseUrl}/api/v1/wishlist`,
      {
        productId,
      },
      {
        headers: {
          token: this.userToken ?? '',
        },
      },
    );
  }

  removeProductFromWishlist(productId: string): Observable<any> {
    return this._httpClient.delete(
      `${environment.baseUrl}/api/v1/wishlist/${productId}`,
      {
        headers: {
          token: this.userToken ?? '',
        },
      },
    );
  }

  getLoggedUserWishlist(): Observable<any> {
    return this._httpClient.get(`${environment.baseUrl}/api/v1/wishlist`, {
      headers: {
        token: this.userToken ?? '',
      },
    });
  }
}
