import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(private readonly _httpClient: HttpClient) {}

  addProductToCart(productId: string): Observable<any> {
    return this._httpClient.post(`${environment.baseUrl}/api/v1/cart`, {
      productId,
    });
  }

  getLoggedUserCart(): Observable<any> {
    return this._httpClient.get(`${environment.baseUrl}/api/v1/cart`, {});
  }

  updateProductQuantity(productId: string, quantity: string): Observable<any> {
    return this._httpClient.put(
      `${environment.baseUrl}/api/v1/cart/${productId}`,
      {
        count: quantity,
      },
    );
  }

  removeItem(itemId: string): Observable<any> {
    return this._httpClient.delete(
      `${environment.baseUrl}/api/v1/cart/${itemId}`,
    );
  }

  clearUserCart(): Observable<any> {
    return this._httpClient.delete(`${environment.baseUrl}/api/v1/cart`);
  }
}
