import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { IShippingAddress } from '../../shared/interfaces/ishipping-address';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  constructor(
    private readonly _httpClient: HttpClient,
    @Inject(PLATFORM_ID) private readonly _platformId: object,
  ) {
    if (isPlatformBrowser(this._platformId)) {
      this.userToken = localStorage.getItem('userToken') ?? '';
    }
  }
  private userToken: string = '';

  payWithCredit(
    cartId: string,
    shippingAddress: IShippingAddress,
  ): Observable<any> {
    return this._httpClient.post(
      `${environment.baseUrl}/api/v1/orders/checkout-session/${cartId}?url=http://localhost:4200`,
      {
        shippingAddress,
      },
      {
        headers: {
          token: this.userToken,
        },
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
      {
        headers: {
          token: this.userToken,
        },
      },
    );
  }
}
