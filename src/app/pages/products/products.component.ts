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
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ICategory } from '../../shared/interfaces/icategory';
import { CategoriesService } from '../../core/services/categories.service';
import { BrandsService } from '../../core/services/brands.service';
import { IBrand } from '../../shared/interfaces/ibrand';
import { IProductsFiltrationOptions } from '../../shared/interfaces/iproducts-filtration-options';
import { DrawerModule } from 'primeng/drawer';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-products',
  imports: [
    ProductCardComponent,
    FormsModule,
    ReactiveFormsModule,
    DrawerModule,
    PaginationComponent,
    TranslatePipe,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit, OnDestroy {
  // Services
  private readonly _productsServices: ProductsService = inject(ProductsService);
  private readonly _platformId: object = inject(PLATFORM_ID);
  private readonly _categoryService: CategoriesService =
    inject(CategoriesService);
  private readonly _brandsService: BrandsService = inject(BrandsService);
  private readonly _formBuilder: FormBuilder = inject(FormBuilder);

  constructor() {
    if (
      isPlatformBrowser(this._platformId) &&
      localStorage.getItem('pageIndex')
    ) {
      this.pageIndex = Number(localStorage.getItem('pageIndex'));
    }

    this._initFormFiltration();
  }

  // Properties
  pageIndex: number = 1;
  pageSize: number = 10;
  displayProducts: IProduct[] = [];
  allProducts: IProduct[] = [];
  allCategories: ICategory[] = [];
  allBrands: IBrand[] = [];
  filtrationForm!: FormGroup;
  isFiltered: boolean = false;
  sortValue: string = '';
  searchValue: string = '';
  drawerVisible: boolean = false;

  // Subscriptions
  getDisplayedProductsSubscription: Subscription | null = null;
  getAllProductsSubscription: Subscription | null = null;
  getAllCategoriesSubscription: Subscription | null = null;
  getAllBrandsSubscription: Subscription | null = null;

  // Hooks
  ngOnInit(): void {
    this._initAllProducts();
    this._initProducts({
      pageNumber: this.pageIndex.toString(),
      limit: this.pageSize.toString(),
    });
    this._initCategories();
    this._initBrands();
  }

  // Methods
  moveToPage(pageNumber: number): void {
    if (pageNumber < 1) {
      this.pageIndex = 1;
      return;
    }
    this.pageIndex = pageNumber;

    if (this.isFiltered) {
      const filterOptions = this.filtrationForm.value;
      this._initProducts({
        pageNumber: this.pageIndex.toString(),
        limit: this.pageSize.toString(),
        categoriesIds: this._getCategoriesIds(),
        brandId: filterOptions.brand,
        minPrice: filterOptions.minPrice,
        maxPrice: filterOptions.maxPrice,
        sort: this.sortValue,
      });
    } else {
      this._initProducts({
        pageNumber: this.pageIndex.toString(),
        limit: this.pageSize.toString(),
        sort: this.sortValue,
      });
    }
  }

  private _initProducts(options?: IProductsFiltrationOptions): void {
    this._updatePageIndexOnLocalStorage();

    // Making sure the previous subscription is unsubscribed.
    this.getDisplayedProductsSubscription?.unsubscribe();

    this.getDisplayedProductsSubscription = this._productsServices
      .getAllProducts(options)
      .subscribe({
        next: (response) => {
          this.displayProducts = response.data;
        },
      });
  }

  private _initFormFiltration(): void {
    this.filtrationForm = this._formBuilder.group({
      categories: this._formBuilder.array([]),
      brand: [''],
      minPrice: [100],
      maxPrice: [100000],
    });
  }

  private _initFormFiltrationCheckboxes(): void {
    this.allCategories.forEach((category) => {
      const categories = this.filtrationForm.get('categories') as FormArray;
      categories.push(this._formBuilder.control(false));
    });
  }

  private _updatePageIndexOnLocalStorage() {
    localStorage.setItem('pageIndex', this.pageIndex.toString());
  }

  private _initCategories(): void {
    this.getAllCategoriesSubscription = this._categoryService
      .getAllCategories()
      .subscribe((response) => {
        this.allCategories = response.data;
        this._initFormFiltrationCheckboxes();
      });
  }

  private _initBrands(): void {
    this.getAllBrandsSubscription = this._brandsService
      .getAllBrands()
      .subscribe((response) => (this.allBrands = response.data));
  }

  private _initAllProducts(): void {
    this.getAllProductsSubscription = this._productsServices
      .getAllProducts({
        limit: '1000',
      })
      .subscribe((response) => (this.allProducts = response.data));
  }

  private _getCategoriesIds(): string[] {
    return this.filtrationForm.value.categories
      .map((val: boolean, i: number) =>
        val ? this.allCategories[i]._id : null,
      )
      .filter((val: string) => val !== null);
  }

  filter(): void {
    this.isFiltered = true;
    this.pageIndex = 1;
    const filterOptions = this.filtrationForm.value;
    this._initProducts({
      pageNumber: this.pageIndex.toString(),
      limit: this.pageSize.toString(),
      categoriesIds: this._getCategoriesIds(),
      brandId: filterOptions.brand,
      minPrice: filterOptions.minPrice,
      maxPrice: filterOptions.maxPrice,
    });
  }

  clear(): void {
    this.isFiltered = false;
    this.pageIndex = 1;
    this._initProducts({
      pageNumber: this.pageIndex.toString(),
      limit: this.pageSize.toString(),
    });
  }

  sort(sortValue: string): void {
    this.pageIndex = 1;
    if (this.isFiltered) {
      const filterOptions = this.filtrationForm.value;
      this._initProducts({
        pageNumber: this.pageIndex.toString(),
        limit: this.pageSize.toString(),
        categoriesIds: this._getCategoriesIds(),
        brandId: filterOptions.brand,
        minPrice: filterOptions.minPrice,
        maxPrice: filterOptions.maxPrice,
        sort: sortValue,
      });
    } else {
      this._initProducts({
        pageNumber: this.pageIndex.toString(),
        limit: this.pageSize.toString(),
        sort: sortValue,
      });
    }
  }

  search(searchValue: string): void {
    if (!searchValue) {
      this._initProducts({
        pageNumber: this.pageIndex.toString(),
        limit: '10',
      });
      return;
    }
    const normalizedSearchValue = searchValue.toLowerCase();
    this.displayProducts = this.allProducts.filter((product) => {
      const normalizedProductName = product.title.toLowerCase();
      const normalizedProductDescription = product.description.toLowerCase();
      return (
        normalizedProductName.includes(normalizedSearchValue) ||
        normalizedProductDescription.includes(normalizedSearchValue)
      );
    });
  }

  ngOnDestroy(): void {
    this.getDisplayedProductsSubscription?.unsubscribe();
    this.getAllProductsSubscription?.unsubscribe();
    this.getAllCategoriesSubscription?.unsubscribe();
    this.getAllBrandsSubscription?.unsubscribe();
  }
}
