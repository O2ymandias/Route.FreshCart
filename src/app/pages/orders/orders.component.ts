import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { OrdersService } from '../../core/services/orders.service';
import { IOrder } from '../../shared/interfaces/iorder';
import { AuthService } from '../../core/services/auth.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Dialog } from 'primeng/dialog';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-orders',
  imports: [DatePipe, CurrencyPipe, Dialog, RouterLink, TranslatePipe],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent implements OnInit, OnDestroy {
  // Services
  private readonly _ordersService: OrdersService = inject(OrdersService);
  private readonly _authService: AuthService = inject(AuthService);

  // Properties
  allOrders: IOrder[] = [];
  showOrderDetails: boolean = false;
  currentOrder: IOrder | null = null;

  // Subscriptions
  getUserOrdersSubscription: Subscription | null = null;

  // Hooks
  ngOnInit(): void {
    this._initOrders();
  }

  // Methods
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
        this.getUserOrdersSubscription = this._ordersService
          .getUserOrders(userData.id)
          .subscribe((res) => {
            this.allOrders = res;
          });
      }
    }
  }

  ngOnDestroy(): void {
    this.getUserOrdersSubscription?.unsubscribe();
  }
}
