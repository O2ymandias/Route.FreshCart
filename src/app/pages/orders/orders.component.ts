import { Component, inject, OnInit } from '@angular/core';
import { OrdersService } from '../../core/services/orders.service';
import { IOrder } from '../../shared/interfaces/iorder';
import { AuthService } from '../../core/services/auth.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Dialog } from 'primeng/dialog';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-orders',
  imports: [DatePipe, CurrencyPipe, Dialog, RouterLink],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent implements OnInit {
  private readonly _ordersService: OrdersService = inject(OrdersService);
  private readonly _authService: AuthService = inject(AuthService);

  allOrders: IOrder[] = [];
  showOrderDetails: boolean = false;
  currentOrder: IOrder | null = null;
  ngOnInit(): void {
    this._initOrders();
  }

  showOrderDetailsDialog(order: IOrder) {
    this.showOrderDetails = true;
    this.currentOrder = order;
  }

  private _initOrders(): void {
    const token = localStorage.getItem('userToken');
    if (token) {
      const userData = this._authService.decodeToken(
        localStorage.getItem('userToken')!,
      );

      if (userData) {
        this._ordersService.getUserOrders(userData.id).subscribe((res) => {
          this.allOrders = res;
        });
      }
    }
  }
}
