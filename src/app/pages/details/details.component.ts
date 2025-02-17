import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductsService } from '../../core/services/products.service';
import { Subscription } from 'rxjs';
import { IProduct } from '../../shared/interfaces/iproduct';
import { GalleriaModule } from 'primeng/galleria';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-details',
  imports: [RouterLink, GalleriaModule, ButtonModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export class DetailsComponent implements OnInit, OnDestroy {
  // Services
  private readonly _productService: ProductsService = inject(ProductsService);
  private readonly _activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly _router: Router = inject(Router);

  // Subscriptions
  private _getProductByIdSubscription: Subscription | null = null;
  private _getRouteParamSubscription: Subscription | null = null;

  // Properties
  productDetails: IProduct | null = null;
  displayBasic: boolean = false;
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
    this._getRouteParamSubscription = this._activatedRoute.paramMap.subscribe({
      next: (params) => {
        const productId: string | null = params.get('id');
        if (productId !== null) this._getSpecificProduct(productId);
      },
    });
  }

  ngOnDestroy(): void {
    this._getRouteParamSubscription?.unsubscribe();
    this._getProductByIdSubscription?.unsubscribe();
  }

  private _getSpecificProduct(id: string) {
    this._productService.getSpecificProduct(id).subscribe({
      next: (response) => {
        this.productDetails = response.data;
      },
      error: (httpErrorResponse: HttpErrorResponse) => {
        if (httpErrorResponse.status === 400) {
          this._router.navigate(['notfound']);
        }
      },
    });
  }
}
