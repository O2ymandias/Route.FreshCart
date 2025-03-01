import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../core/services/products.service';
import { Subscription } from 'rxjs';
import { IProduct } from '../../shared/interfaces/iproduct';
import { GalleriaModule } from 'primeng/galleria';
import { ButtonModule } from 'primeng/button';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { CurrencyPipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-details',
  imports: [GalleriaModule, ButtonModule, CurrencyPipe, TranslatePipe],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export class DetailsComponent implements OnInit, OnDestroy {
  // Services
  private readonly _productService: ProductsService = inject(ProductsService);
  private readonly _activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly _cartService: CartService = inject(CartService);
  private readonly _router: Router = inject(Router);
  private readonly _wishListService: WishlistService = inject(WishlistService);
  private readonly _toastrService: ToastrService = inject(ToastrService);

  // Subscriptions
  getProductByIdSubscription: Subscription | null = null;
  getRouteParamSubscription: Subscription | null = null;
  addProductToCartSubscription: Subscription | null = null;
  addProductToWishlistSubscription: Subscription | null = null;

  // Properties
  productDetails: IProduct | null = null;
  displayBasic: boolean = false;
  stars: number[] = [];

  responsiveOptions: any[] = [
    {
      breakpoint: '1500px',
      numVisible: 5,
    },
    {
      breakpoint: '1024px',
      numVisible: 3,
    },
    {
      breakpoint: '768px',
      numVisible: 2,
    },
    {
      breakpoint: '560px',
      numVisible: 1,
    },
  ];

  // Hooks
  ngOnInit(): void {
    this._initProductDetails();
  }

  // Methods
  addProductToCart(): void {
    if (this.productDetails === null) return;

    // Making sure the previous subscription is unsubscribed
    this.addProductToCartSubscription?.unsubscribe();

    this.addProductToCartSubscription = this._cartService
      .addProductToCart(this.productDetails.id)
      .subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this._toastrService.success(response.message, 'FreshCart');
            this._cartService.numberOfItems.set(response.numOfCartItems);
          }
        },
      });
  }
  addProductToWishlist(): void {
    if (this.productDetails === null) return;

    // Making sure the previous subscription is unsubscribed
    this.addProductToWishlistSubscription?.unsubscribe();

    this.addProductToWishlistSubscription = this._wishListService
      .addProductToWishlist(this.productDetails.id)
      .subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this._toastrService.success(response.message, 'FreshCart');
            this._wishListService.numberOfItems.set(response.data.length);
          }
        },
      });
  }

  private _getSpecificProduct(id: string) {
    this.getProductByIdSubscription = this._productService
      .getSpecificProduct(id)
      .subscribe({
        next: (response) => {
          this.productDetails = response.data;
          this._calcRatingStars();
        },
        error: (httpErrorResponse: HttpErrorResponse) => {
          if (httpErrorResponse.status === 400) {
            this._router.navigate(['/notfound']);
          }
        },
      });
  }
  private _initProductDetails(): void {
    this.getRouteParamSubscription = this._activatedRoute.paramMap.subscribe({
      next: (params) => {
        const productId: string | null = params.get('id');
        if (productId !== null) this._getSpecificProduct(productId);
      },
    });
  }
  private _calcRatingStars(): void {
    if (this.productDetails)
      this.stars = Array(Math.floor(this.productDetails.ratingsAverage)).fill(
        0,
      );
  }

  ngOnDestroy(): void {
    this.getRouteParamSubscription?.unsubscribe();
    this.getProductByIdSubscription?.unsubscribe();
    this.addProductToCartSubscription?.unsubscribe();
    this.addProductToWishlistSubscription?.unsubscribe();
  }
}
