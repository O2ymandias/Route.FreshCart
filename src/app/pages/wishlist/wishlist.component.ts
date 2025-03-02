import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { WishlistService } from '../../core/services/wishlist.service';
import { IProduct } from '../../shared/interfaces/iproduct';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-wishlist',
  imports: [ProductCardComponent, RouterLink, TranslatePipe],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss',
})
export class WishlistComponent implements OnInit, OnDestroy {
  // Services
  private readonly _wishlistService: WishlistService = inject(WishlistService);

  // Properties
  products: WritableSignal<IProduct[]> = signal([]);
  count: WritableSignal<number> = signal(0);

  // Subscriptions
  wishlistSubscription: Subscription | null = null;

  // Hooks
  ngOnInit(): void {
    this.wishlistSubscription = this._wishlistService
      .getLoggedUserWishlist()
      .subscribe({
        next: (response) => {
          this.updateWishList(response);
        },
      });
  }

  // Methods
  updateWishList(response: any): void {
    this.products.set(response.data);
    this.count.set(response.count);
  }

  ngOnDestroy(): void {
    this.wishlistSubscription?.unsubscribe();
  }
}
