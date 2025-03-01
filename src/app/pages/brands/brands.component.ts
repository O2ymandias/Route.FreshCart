import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { BrandsService } from '../../core/services/brands.service';
import { IBrand } from '../../shared/interfaces/ibrand';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-brands',
  imports: [PaginationComponent, TranslatePipe],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss',
})
export class BrandsComponent implements OnInit, OnDestroy {
  // Services
  private readonly _brandsService: BrandsService = inject(BrandsService);

  // Properties
  displayBrands: WritableSignal<IBrand[]> = signal([]);
  pageNumber: WritableSignal<number> = signal(1);
  private readonly _pageSize: WritableSignal<number> = signal(10);

  // Subscriptions
  brandSubscription: Subscription | null = null;

  // Hooks
  ngOnInit(): void {
    this.getBrands(this.pageNumber());
  }

  // Methods
  getBrands(pageNumber: number): void {
    // Making sure the previous subscription is unsubscribed
    if (this.brandSubscription) this.brandSubscription.unsubscribe();

    this.brandSubscription = this._brandsService
      .getAllBrands(this._pageSize.toString(), pageNumber.toString())
      .subscribe((response) => {
        this.displayBrands.set(response.data);
      });
  }
  moveToPage(pageNumber: number): void {
    if (pageNumber < 1) return;
    this.pageNumber.set(pageNumber);
    this.getBrands(pageNumber);
  }

  ngOnDestroy(): void {
    if (this.brandSubscription) this.brandSubscription.unsubscribe();
  }
}
