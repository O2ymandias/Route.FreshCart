import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(
    private readonly _httpClient: HttpClient,
    @Inject(PLATFORM_ID) private readonly _platformId: object,
  ) {
    if (isPlatformBrowser(this._platformId)) {
      this.userToken = localStorage.getItem('userToken') ?? '';
    }
  }

  private userToken: string = '';

  addProductToCart(productId: string): Observable<any> {
    return this._httpClient.post(
      `${environment.baseUrl}/api/v1/cart`,
      { productId },
      {
        headers: {
          token: this.userToken,
        },
      },
    );
  }

  getLoggedUserCart(): Observable<any> {
    return this._httpClient.get(`${environment.baseUrl}/api/v1/cart`, {
      headers: {
        token: this.userToken,
      },
    });
  }

  updateProductQuantity(productId: string, quantity: string): Observable<any> {
    return this._httpClient.put(
      `${environment.baseUrl}/api/v1/cart/${productId}`,
      {
        count: quantity,
      },
      {
        headers: {
          token: this.userToken,
        },
      },
    );
  }

  removeItem(itemId: string): Observable<any> {
    return this._httpClient.delete(
      `${environment.baseUrl}/api/v1/cart/${itemId}`,
      {
        headers: {
          token: this.userToken,
        },
      },
    );
  }

  clearUserCart(): Observable<any> {
    return this._httpClient.delete(`${environment.baseUrl}/api/v1/cart`, {
      headers: {
        token: this.userToken,
      },
    });
  }
}
