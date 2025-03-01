import {
  Component,
  inject,
  input,
  InputSignal,
  OnDestroy,
  OnInit,
  output,
  OutputEmitterRef,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { Subscription } from 'rxjs';
import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, TitleCasePipe, CurrencyPipe, TranslatePipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent implements OnInit, OnDestroy {
  // Services
  private readonly _cartService: CartService = inject(CartService);
  private readonly _wishlistService: WishlistService = inject(WishlistService);
  private readonly _toastrService: ToastrService = inject(ToastrService);
  private readonly _translateService: TranslateService =
    inject(TranslateService);

  // Input Properties
  imagePath: InputSignal<string> = input.required();
  title: InputSignal<string> = input.required();
  rating: InputSignal<number> = input.required();
  price: InputSignal<number> = input.required();
  id: InputSignal<string> = input.required();
  addToFavorites: InputSignal<boolean> = input(false);
  removeProduct: InputSignal<boolean> = input(false);
  quantity: InputSignal<number> = input.required();

  // Other Properties
  updatedproductsEmitter: OutputEmitterRef<any> = output<any>();
  stars!: number[];
  isRemoving: boolean = false;

  // Subscriptions
  addToWishlistSubscription: Subscription | null = null;
  removeToWishlistSubscription: Subscription | null = null;
  addToCartSubscription: Subscription | null = null;
  getLoggedUserWishlistSubscription: Subscription | null = null;

  // Hooks
  ngOnInit(): void {
    this.stars = Array(Math.floor(this.rating())).fill(0);
  }

  // Methods
  addToCart(): void {
    this.addToCartSubscription = this._cartService
      .addProductToCart(this.id())
      .subscribe({
        next: (response) => {
          if (response.status === 'success') {
            let message =
              this._translateService.currentLang === 'en'
                ? 'Product added to cart'
                : 'تم إضافة المنتج إلى السلة';
            this._toastrService.success(message, 'FreshCart');
            this._cartService.numberOfItems.set(response.numOfCartItems);
          }
        },
      });
  }

  addToWishlist(): void {
    this.addToWishlistSubscription = this._wishlistService
      .addProductToWishlist(this.id())
      .subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this._wishlistService.numberOfItems.set(response.data.length);
            let message =
              this._translateService.currentLang === 'en'
                ? 'Product added to wishlist'
                : 'تم إضافة المنتج إلى قائمة الرغبات';
            this._toastrService.success(message, 'FreshCart');
          }
        },
      });
  }

  removeFromWishlist(): void {
    this.isRemoving = true;
    this.removeToWishlistSubscription = this._wishlistService
      .removeProductFromWishlist(this.id())
      .subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this._wishlistService.numberOfItems.set(response.data.length);
            this.getLoggedUserWishlistSubscription = this._wishlistService
              .getLoggedUserWishlist()
              .subscribe({
                next: (response) => {
                  this.isRemoving = false;
                  this.updatedproductsEmitter.emit(response);
                },
              });
          }
        },
      });
  }

  ngOnDestroy(): void {
    this.addToWishlistSubscription?.unsubscribe();
    this.removeToWishlistSubscription?.unsubscribe();
    this.addToCartSubscription?.unsubscribe();
    this.getLoggedUserWishlistSubscription?.unsubscribe();
  }
}
