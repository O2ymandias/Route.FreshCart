import { WishlistService } from './../../core/services/wishlist.service';
import {
  Component,
  ElementRef,
  inject,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { ICartData } from '../../shared/interfaces/icart-data';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-cart',
  imports: [RouterLink, FormsModule, ConfirmDialog, ToastModule],
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

  // Properties
  cartData: ICartData | null = null;
  @ViewChildren('updateQuantityBtn')
  updateQuantityBtns: QueryList<ElementRef<HTMLButtonElement>> | null = null;

  clearCartSpinner: boolean = false;

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

    this._cartService.removeItem(itemId).subscribe((response) => {
      if (removeSpinner) {
        this._renderer2.setStyle(removeSpinner, 'display', 'none');
      }
      this._setCartData(response);
      this._cartService.numberOfItems.set(response.numOfCartItems);
    });
  }
  updateQuantity(productId: string, newQuantity: number) {
    this._disableUpdateBtns();
    this._cartService
      .updateProductQuantity(productId, newQuantity.toString())
      .subscribe((response) => {
        this._enableUpdateBtns();
        this._setCartData(response);
      });
  }
  clearCart(): void {
    this._confirmationService.confirm({
      message: 'Are you sure you want to clear your cart?',
      header: 'Clear',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger',
      },
      accept: () => {
        this.clearCartSpinner = true;
        this._cartService.clearUserCart().subscribe({
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
    this._wishlistService.addProductToWishlist(productId).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  private _getCartData(): void {
    this._cartService.getLoggedUserCart().subscribe((response) => {
      console.log(response);
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
}
