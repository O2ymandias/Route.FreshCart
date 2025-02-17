import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ProductsService } from '../../core/services/products.service';
import { IProduct } from '../../shared/interfaces/iproduct';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { ICategory } from '../../shared/interfaces/icategory';
import { CategoriesService } from '../../core/services/categories.service';
import { Subscription } from 'rxjs';
import { CategorySliderComponent } from '../../shared/components/category-slider/category-slider.component';
import { GalleriaModule } from 'primeng/galleria';
import { CartService } from '../../core/services/cart.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-home',
  imports: [ProductCardComponent, CategorySliderComponent, GalleriaModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  // Services
  private readonly _productsService: ProductsService = inject(ProductsService);
  private readonly _categoriesService: CategoriesService =
    inject(CategoriesService);

  // Subscriptions
  private _getProductsSubscription!: Subscription;
  private _getCategoriesSubscription!: Subscription;

  // Properties
  mainCarouselImages = [
    'images/img1.avif',
    'images/img2.avif',
    'images/img3.avif',
    'images/img4.avif',
    'images/img5.avif',
    'images/img6.avif',
    'images/img7.avif',
  ];
  products: IProduct[] = [];
  categories: ICategory[] = [];

  // Hooks
  ngOnInit(): void {
    this._getProducts();
    this._getCategories();
  }
  ngOnDestroy(): void {
    this._getProductsSubscription?.unsubscribe();
    this._getCategoriesSubscription?.unsubscribe();
  }

  // Methods
  private _getProducts(): void {
    this._getProductsSubscription = this._productsService
      .getAllProducts()
      .subscribe({
        next: (response) => {
          this.products = response.data;
        },
      });
  }
  private _getCategories(): void {
    this._getCategoriesSubscription = this._categoriesService
      .getAllCategories()
      .subscribe({
        next: (response) => {
          this.categories = response.data;
        },
      });
  }
}
