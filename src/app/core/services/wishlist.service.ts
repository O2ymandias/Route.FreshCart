import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
  OnInit,
  PLATFORM_ID,
  signal,
  WritableSignal,
} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
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
      localStorage.getItem('userToken')
    ) {
      // Setting the number of items in the wishlist
      this.getNumberOfItems();
    }
  }

  // numberOfItems: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  numberOfItems: WritableSignal<number> = signal(0);

  addProductToWishlist(productId: string): Observable<any> {
    return this._httpClient.post(`${environment.baseUrl}/api/v1/wishlist`, {
      productId,
    });
  }

  removeProductFromWishlist(productId: string): Observable<any> {
    return this._httpClient.delete(
      `${environment.baseUrl}/api/v1/wishlist/${productId}`,
    );
  }

  getLoggedUserWishlist(): Observable<any> {
    return this._httpClient.get(`${environment.baseUrl}/api/v1/wishlist`);
  }

  getNumberOfItems(): void {
    this.getLoggedUserWishlist().subscribe((response) => {
      this.numberOfItems.set(response.data.length);
    });
  }
}
