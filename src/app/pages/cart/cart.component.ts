import { WishlistService } from './../../core/services/wishlist.service';
import {
  Component,
  ElementRef,
  inject,
  OnInit,
  QueryList,
  Renderer2,
  ViewChildren,
} from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { ICartData } from '../../shared/interfaces/icart-data';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { CurrencyPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart',
  imports: [
    RouterLink,
    FormsModule,
    ConfirmDialog,
    ToastModule,
    TranslatePipe,
    CurrencyPipe,
  ],
  providers: [ConfirmationService],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  // Services
  private readonly _cartService: CartService = inject(CartService);
  private readonly _renderer2: Renderer2 = inject(Renderer2);
  private readonly _wishlistService: WishlistService = inject(WishlistService);
  private readonly _confirmationService: ConfirmationService =
    inject(ConfirmationService);
  private readonly _translateService: TranslateService =
    inject(TranslateService);
  private readonly _toastrService: ToastrService = inject(ToastrService);

  // Properties
  cartData: ICartData | null = null;
  @ViewChildren('updateQuantityBtn')
  updateQuantityBtns: QueryList<ElementRef<HTMLButtonElement>> | null = null;
  clearCartSpinner: boolean = false;

  // Subscriptions
  removeCartItemSubscription: Subscription | null = null;
  updateQuantitySubscription: Subscription | null = null;
  clearCartSubscription: Subscription | null = null;
  cartDataSubscription: Subscription | null = null;
  addToWishlistSubscription: Subscription | null = null;

  // Hooks
  ngOnInit(): void {
    this._getCartData();
  }

  // Methods
  removeCartItem(event: any, itemId: string) {
    const removeSpinner = (event.target as HTMLElement)
      .closest('button')
      ?.querySelector('i');

    if (removeSpinner) {
      this._renderer2.setStyle(removeSpinner, 'display', 'inline-block');
    }

    // Making sure the previous subscription is unsubscribed.
    this.removeCartItemSubscription?.unsubscribe();

    this.removeCartItemSubscription = this._cartService
      .removeItem(itemId)
      .subscribe((response) => {
        if (removeSpinner) {
          this._renderer2.setStyle(removeSpinner, 'display', 'none');
        }
        this._setCartData(response);
        this._cartService.numberOfItems.set(response.numOfCartItems);
      });
  }
  updateQuantity(productId: string, newQuantity: number) {
    this._disableUpdateBtns();

    // Making sure the previous subscription is unsubscribed.
    this.updateQuantitySubscription?.unsubscribe();

    this.updateQuantitySubscription = this._cartService
      .updateProductQuantity(productId, newQuantity.toString())
      .subscribe((response) => {
        this._enableUpdateBtns();
        this._setCartData(response);
      });
  }
  clearCart(): void {
    let message =
      this._translateService.currentLang === 'en'
        ? 'Are you sure you want to clear your cart?'
        : 'هل أنت متأكد من مسح سلة التسوق الخاصة بك؟';

    let header =
      this._translateService.currentLang === 'en'
        ? 'Clear Cart'
        : 'مسح سلة التسوق';

    let cancelLabel =
      this._translateService.currentLang === 'en' ? 'Cancel' : 'إلغاء';

    let deleteLabel =
      this._translateService.currentLang === 'en' ? 'Delete' : 'حذف';

    this._confirmationService.confirm({
      message: message,
      header: header,
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: cancelLabel,
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: deleteLabel,
        severity: 'danger',
      },
      accept: () => {
        this.clearCartSpinner = true;

        // Making sure the previous subscription is unsubscribed.
        this.clearCartSubscription?.unsubscribe();

        this.clearCartSubscription = this._cartService
          .clearUserCart()
          .subscribe({
            next: (response) => {
              if (response.message === 'success') {
                this.cartData = null;
                this.clearCartSpinner = false;
                this._cartService.numberOfItems.set(0);
              }
            },
          });
      },
    });
  }
  addToWishList(productId: string): void {
    // Making sure the previous subscription is unsubscribed.
    this.addToWishlistSubscription?.unsubscribe();

    this.addToWishlistSubscription = this._wishlistService
      .addProductToWishlist(productId)
      .subscribe({
        next: (response) => {
          if (response.status === 'success') {
            let message =
              this._translateService.currentLang === 'en'
                ? 'Product added to wishlist'
                : 'تم إضافة المنتج إلى قائمة الرغبات';

            this._toastrService.success(message, 'FreshCart');
            this._wishlistService.numberOfItems.set(response.data.length);
          }
        },
      });
  }

  private _getCartData(): void {
    // Making sure the previous subscription is unsubscribed.
    this.cartDataSubscription?.unsubscribe();

    this.cartDataSubscription = this._cartService
      .getLoggedUserCart()
      .subscribe((response) => {
        this._setCartData(response);
      });
  }
  private _disableUpdateBtns(): void {
    this.updateQuantityBtns?.forEach((btnRef) => {
      this._renderer2.setAttribute(btnRef.nativeElement, 'disabled', 'true');
    });
  }
  private _enableUpdateBtns(): void {
    this.updateQuantityBtns?.forEach((btnRef) => {
      this._renderer2.removeAttribute(btnRef.nativeElement, 'disabled');
    });
  }
  private _setCartData(response: any): void {
    this.cartData = {
      numOfCartItems: response.numOfCartItems,
      cartId: response.cartId,
      products: response.data.products,
      totalCartPrice: response.data.totalCartPrice,
    };
  }

  ngOnDestroy(): void {
    this.removeCartItemSubscription?.unsubscribe();
    this.updateQuantitySubscription?.unsubscribe();
    this.clearCartSubscription?.unsubscribe();
    this.cartDataSubscription?.unsubscribe();
    this.addToWishlistSubscription?.unsubscribe();
  }
}
