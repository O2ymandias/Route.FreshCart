import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { HttpErrorResponse } from '@angular/common/http';
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

  // Properties
  cartData: ICartData | null = null;
  showRemoveLoader: boolean = false;

  // Hooks
  ngOnInit(): void {
    this._getCartData();
  }

  private _getCartData(): void {
    this._cartService.getLoggedUserCart().subscribe({
      next: (response) => {
        this.cartData = {
          products: response.data.products,
          totalCartPrice: response.data.totalCartPrice,
        };
      },
      error: (httpErrorResponse: HttpErrorResponse) => {
        console.log(httpErrorResponse.error);
      },
    });
  }

  removeCartItem(itemId: string) {
    this.showRemoveLoader = true;
    this._cartService.removeItem(itemId).subscribe((response) => {
      this.showRemoveLoader = false;
      this.cartData = {
        products: response.data.products,
        totalCartPrice: response.data.totalCartPrice,
      };
    });
  }
}
