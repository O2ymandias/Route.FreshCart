import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { ProductsService } from '../../core/services/products.service';
import { IProduct } from '../../shared/interfaces/iproduct';
import { Subscription } from 'rxjs';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ICategory } from '../../shared/interfaces/icategory';
import { CategoriesService } from '../../core/services/categories.service';

@Component({
  selector: 'app-products',
  imports: [ProductCardComponent, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit, OnDestroy {
  // Services
  private readonly _productsServices: ProductsService = inject(ProductsService);
  private readonly _platformId: object = inject(PLATFORM_ID);
  private readonly _categoryService: CategoriesService =
    inject(CategoriesService);

  constructor() {
    if (
      isPlatformBrowser(this._platformId) &&
      localStorage.getItem('pageIndex')
    ) {
      this.pageIndex = Number(localStorage.getItem('pageIndex'));
    }
  }

  // Properties
  allProducts: IProduct[] = [];
  paginatedProducts: IProduct[] = [];
  searchedProducts: IProduct[] = [];
  pageIndex: number = 1;
  pageSize: number = 10;
  searchValue: string | null = null;

  filteredProducts: IProduct[] = [];
  filteredCategoryValue: string = '';
  allCategories: ICategory[] = [];

  // Subscriptions
  getAllProductsSubscription: Subscription | null = null;

  ngOnInit(): void {
    this._initAllProducts();
    this._initCategories();
  }

  private _initAllProducts(): void {
    this.getAllProductsSubscription = this._productsServices
      .getAllProducts()
      .subscribe({
        next: (response) => {
          this.allProducts = response.data;
          this.initPaginatedProducts(this.pageIndex);
        },
      });
  }

  private _updateLocalStorage() {
    localStorage.setItem('pageIndex', this.pageIndex.toString());
  }

  searchProducts(searchValue: string | null): void {
    if (!searchValue) return;
    this.searchedProducts = this.allProducts.filter((p) => {
      const normalizedSearchValue = searchValue.toLowerCase();
      const normalizedTitle = p.title.toLowerCase();
      const normalizedDescription = p.description.toLowerCase();
      return (
        normalizedTitle.includes(normalizedSearchValue) ||
        normalizedDescription.includes(normalizedSearchValue)
      );
    });
  }

  initPaginatedProducts(pageNumber: number) {
    if (pageNumber < 1) return;
    const totalPages = Math.ceil(this.allProducts.length / this.pageSize);
    if (pageNumber > totalPages) return;

    this.pageIndex = pageNumber;
    this._updateLocalStorage();

    const start = (pageNumber - 1) * this.pageSize;
    const end = start + this.pageSize;

    this.paginatedProducts = this.allProducts.slice(start, end);
  }

  filterByCategory(categoryName: string | null): void {
    if (!categoryName) return;

    this.filteredProducts = this.allProducts.filter((p) => {
      const normalizedProductCategoryName = p.category.name.toLowerCase();
      const normalizedCategoryName = categoryName.toLowerCase();
      return normalizedProductCategoryName === normalizedCategoryName;
    });
  }

  private _initCategories(): void {
    this._categoryService
      .getAllCategories()
      .subscribe((response) => (this.allCategories = response.data));
  }

  ngOnDestroy(): void {
    this.getAllProductsSubscription?.unsubscribe();
  }
}
