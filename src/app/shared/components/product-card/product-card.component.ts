import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, input, InputSignal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent implements OnInit {
  private readonly _cartService: CartService = inject(CartService);

  imagePath: InputSignal<string> = input.required();
  title: InputSignal<string> = input.required();
  rating: InputSignal<number> = input.required();
  price: InputSignal<number> = input.required();
  id: InputSignal<string> = input.required();

  stars!: number[];

  ngOnInit(): void {
    this.stars = Array(Math.floor(this.rating())).fill(0);
  }

  addToCart(productId: string): void {
    this._cartService.addProductToCart(productId).subscribe({
      next: (response) => {},

      error: (httpErrorResponse: HttpErrorResponse) => {},
    });
  }
}
