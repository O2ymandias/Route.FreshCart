import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
  PLATFORM_ID,
  signal,
  WritableSignal,
} from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(
    private readonly _httpClient: HttpClient,
    @Inject(PLATFORM_ID) platformId: object,
  ) {
    if (isPlatformBrowser(platformId) && localStorage.getItem('userToken')) {
      this.getLoggedUserCart().subscribe((response) =>
        this.numberOfItems.set(response.numOfCartItems),
      );
    }
  }

  numberOfItems: WritableSignal<number> = signal(0);

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
