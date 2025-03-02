import { Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { IShippingAddress } from '../../shared/interfaces/ishipping-address';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  constructor(private readonly _httpClient: HttpClient) {}

  domain: string = 'http://localhost:4200';
  vercelDomain: string = 'https://route-fresh-cart.vercel.app';

  payWithCredit(
    cartId: string,
    shippingAddress: IShippingAddress,
  ): Observable<any> {
    return this._httpClient.post(
      `${environment.baseUrl}/api/v1/orders/checkout-session/${cartId}?url=${this.vercelDomain}`,
      {
        shippingAddress,
      },
    );
  }

  payWithCash(
    cartId: string,
    shippingAddress: IShippingAddress,
  ): Observable<any> {
    return this._httpClient.post(
      `${environment.baseUrl}/api/v1/orders/${cartId}`,
      {
        shippingAddress,
      },
    );
  }

  getUserOrders(userId: string): Observable<any> {
    return this._httpClient.get(
      `${environment.baseUrl}/api/v1/orders/user/${userId}`,
    );
  }
}
