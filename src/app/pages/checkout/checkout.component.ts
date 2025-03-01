import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { IUserData } from '../../shared/interfaces/iuser-data';
import { Subscription } from 'rxjs';
import { OrdersService } from '../../core/services/orders.service';
import { CartService } from '../../core/services/cart.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent implements OnInit, OnDestroy {
  // Services
  private readonly _formBuilder: FormBuilder = inject(FormBuilder);
  private readonly _activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly _router: Router = inject(Router);
  private readonly _authService: AuthService = inject(AuthService);
  private readonly _platformId: object = inject(PLATFORM_ID);
  private readonly _ordersService: OrdersService = inject(OrdersService);
  private readonly _cartService: CartService = inject(CartService);

  // Properties
  cartId: string | null = null;
  userId: string | null = null;
  checkoutForm!: FormGroup;

  // Subscriptions
  cartIdSubscription: Subscription | null = null;
  payWithCreditSubscription: Subscription | null = null;
  payWithCashSubscription: Subscription | null = null;

  // Hooks
  ngOnInit(): void {
    this._initCheckoutForm();
    this._initCartId();
    this._initUserId();
  }

  // Methods
  payWithCredit(): void {
    if (this.checkoutForm.valid) {
      if (this.cartId !== null) {
        this._ordersService
          .payWithCredit(this.cartId, this.checkoutForm.value)
          .subscribe({
            next: (response) => {
              if (response.status === 'success') {
                window.open(response.session.url, '_self');
                this._cartService.numberOfItems.set(0);
              }
            },
          });
      }
    } else {
      this.checkoutForm.markAllAsTouched();
    }
  }

  payWithCash(): void {
    if (this.checkoutForm.valid) {
      if (this.cartId !== null) {
        this._ordersService
          .payWithCash(this.cartId, this.checkoutForm.value)
          .subscribe({
            next: (response) => {
              if (response.status === 'success') {
                this._router.navigate(['/allorders']);
                this._cartService.numberOfItems.set(0);
              }
            },
          });
      }
    } else {
      this.checkoutForm.markAllAsTouched();
    }
  }

  private _initCheckoutForm() {
    this.checkoutForm = this._formBuilder.group({
      details: [null],
      phone: [
        null,
        [Validators.required, Validators.pattern(/^01[0125]\d{8}$/)],
      ],
      city: [null, [Validators.required]],
    });
  }
  private _initCartId() {
    this.cartIdSubscription = this._activatedRoute.paramMap.subscribe({
      next: (params) => (this.cartId = params.get('cartId')),
    });
  }
  private _initUserId() {
    if (isPlatformBrowser(this._platformId)) {
      const token = localStorage.getItem('userToken')!;
      const userData: IUserData | null = this._authService.decodeToken(token);
      if (userData) this.userId = userData.id;
    }
  }

  ngOnDestroy(): void {
    this.payWithCreditSubscription?.unsubscribe();
    this.payWithCashSubscription?.unsubscribe();
    this.cartIdSubscription?.unsubscribe();
  }
}
