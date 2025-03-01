import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { WishlistService } from '../../core/services/wishlist.service';
import { IProduct } from '../../shared/interfaces/iproduct';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-wishlist',
  imports: [ProductCardComponent, RouterLink, TranslatePipe],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss',
})
export class WishlistComponent implements OnInit {
  private readonly _wishlistService: WishlistService = inject(WishlistService);

  products: WritableSignal<IProduct[]> = signal([]);
  count: WritableSignal<number> = signal(0);

  ngOnInit(): void {
    this._wishlistService.getLoggedUserWishlist().subscribe({
      next: (response) => {
        this.updateWishList(response);
      },
    });
  }

  updateWishList(response: any): void {
    this.products.set(response.data);
    this.count.set(response.count);
  }
}
