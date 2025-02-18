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

@Component({
  selector: 'app-cart',
  imports: [RouterLink, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  // Services
  private readonly _cartService: CartService = inject(CartService);
  private readonly _renderer2: Renderer2 = inject(Renderer2);

  // Properties
  cartData: ICartData | null = null;

  @ViewChildren('updateQuantityBtn')
  updateQuantityBtns: QueryList<ElementRef<HTMLButtonElement>> | null = null;

  // Hooks
  ngOnInit(): void {
    this._getCartData();
  }

  removeCartItem(itemId: string) {
    this._cartService.removeItem(itemId).subscribe((response) => {
      this.cartData = {
        cartId: response.cartId,
        products: response.data.products,
        totalCartPrice: response.data.totalCartPrice,
      };
    });
  }

  updateQuantity(productId: string, newQuantity: number) {
    this._disableUpdateBtns();
    this._cartService
      .updateProductQuantity(productId, newQuantity.toString())
      .subscribe((response) => {
        this._enableUpdateBtns();
        this.updateQuantityBtns?.forEach((btnRef) => {
          this._renderer2.removeAttribute(btnRef.nativeElement, 'disabled');
        });
        this.cartData = {
          cartId: response.cartId,
          products: response.data.products,
          totalCartPrice: response.data.totalCartPrice,
        };
      });
  }

  clearCart(): void {
    this._cartService.clearUserCart().subscribe({
      next: (response) => {
        if (response.message === 'success') this._getCartData();
      },
    });
  }

  private _getCartData(): void {
    this._cartService.getLoggedUserCart().subscribe((response) => {
      this.cartData = {
        cartId: response.cartId,
        products: response.data.products,
        totalCartPrice: response.data.totalCartPrice,
      };
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
}
