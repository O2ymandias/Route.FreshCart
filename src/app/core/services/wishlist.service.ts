import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, OnInit, PLATFORM_ID } from '@angular/core';
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
      isPlatformBrowser(this._platformId) 
    ) {
      // Setting the number of items in the wishlist
      this.updateNumberOfItems();
    }
  }

  numberOfItems: BehaviorSubject<number> = new BehaviorSubject<number>(0);

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

  updateNumberOfItems(): void {
    this.getLoggedUserWishlist().subscribe((response) => {
      this.numberOfItems.next(response.count);
    });
  }
}
