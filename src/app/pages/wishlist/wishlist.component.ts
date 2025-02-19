import { Component, inject, OnInit } from '@angular/core';
import { WishlistService } from '../../core/services/wishlist.service';
import { IProduct } from '../../shared/interfaces/iproduct';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-wishlist',
  imports: [ProductCardComponent],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss',
})
export class WishlistComponent implements OnInit {
  private readonly _wishlistService: WishlistService = inject(WishlistService);
  products: IProduct[] = [];
  count: number | null = null;
  ngOnInit(): void {
    this._wishlistService.getLoggedUserWishlist().subscribe({
      next: (response) => {
        this.count = response.count;
        this.products = response.data;
      },
    });
  }

  updateProducts(event: any): void {
    this.products = event.data;
    this.count = event.count;
  }
}
