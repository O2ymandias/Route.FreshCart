import { Component, signal, WritableSignal } from '@angular/core';

@Component({
  selector: 'app-categories',
  imports: [],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent {
  price: number = 10;
  quantity: number = 1;

  totalPrice: number = this.price * this.quantity;

  changeQuantity(): void {
    this.price = this.price + 10;
  }
}
