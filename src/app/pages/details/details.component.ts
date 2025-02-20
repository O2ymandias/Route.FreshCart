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

@Component({
  selector: 'app-details',
  imports: [GalleriaModule, ButtonModule],
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

  // Subscriptions
  private _getProductByIdSubscription: Subscription | null = null;
  private _getRouteParamSubscription: Subscription | null = null;
  private _addProductToCartSubscription: Subscription | null = null;
  private _addProductToWishlistSubscription: Subscription | null = null;

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
    this._cartService.addProductToCart(this.productDetails.id).subscribe();
  }
  addProductToWishlist() {
    if (this.productDetails === null) return;
    this._addProductToWishlistSubscription = this._wishListService
      .addProductToWishlist(this.productDetails.id)
      .subscribe();
  }

  private _getSpecificProduct(id: string) {
    this._productService.getSpecificProduct(id).subscribe({
      next: (response) => {
        this.productDetails = response.data;
        this._calcRatingStars();
      },
      error: (httpErrorResponse: HttpErrorResponse) => {
        if (httpErrorResponse.status === 400) {
          this._router.navigate(['notfound']);
        }
      },
    });
  }
  private _initProductDetails(): void {
    this._getRouteParamSubscription = this._activatedRoute.paramMap.subscribe({
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
    this._getRouteParamSubscription?.unsubscribe();
    this._getProductByIdSubscription?.unsubscribe();
    this._addProductToCartSubscription?.unsubscribe();
    this._addProductToWishlistSubscription?.unsubscribe();
  }
}
