import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  inject,
  input,
  InputSignal,
  OnInit,
  output,
  OutputEmitterRef,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent implements OnInit {
  private readonly _cartService: CartService = inject(CartService);
  private readonly _wishlistService: WishlistService = inject(WishlistService);

  imagePath: InputSignal<string> = input.required();
  title: InputSignal<string> = input.required();
  rating: InputSignal<number> = input.required();
  price: InputSignal<number> = input.required();
  id: InputSignal<string> = input.required();
  addToFavorites: InputSignal<boolean> = input(false);
  removeProduct: InputSignal<boolean> = input(false);

  stars!: number[];

  updatedproductsEmitter: OutputEmitterRef<any> = output<any>();

  ngOnInit(): void {
    this.stars = Array(Math.floor(this.rating())).fill(0);
  }

  addToCart(): void {
    this._cartService.addProductToCart(this.id()).subscribe({
      next: (response) => {},
      error: (error) => {},
    });
  }

  addToWishList(): void {
    this._wishlistService.addProductToWishlist(this.id()).subscribe({
      next: (response) => {},
      error: (error) => {},
    });
  }

  removeFromWishList(): void {
    this._wishlistService.removeProductFromWishlist(this.id()).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this._wishlistService.getLoggedUserWishlist().subscribe({
            next: (response) => {
              this.updatedproductsEmitter.emit(response);
            },
          });
        }
      },
    });
  }
}
