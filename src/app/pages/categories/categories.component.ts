import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { CategoriesService } from '../../core/services/categories.service';
import { ICategory } from '../../shared/interfaces/icategory';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-categories',
  imports: [PaginationComponent, TranslatePipe],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent implements OnInit, OnDestroy {
  // Services
  private readonly _categoriesService: CategoriesService =
    inject(CategoriesService);

  // Properties
  displayCategories: WritableSignal<ICategory[]> = signal([]);
  pageNumber: WritableSignal<number> = signal(1);
  private readonly _pageSize: number = 5;

  // Subscriptions
  categorySubscription: Subscription | null = null;

  // Hooks
  ngOnInit(): void {
    this.getCategories(this.pageNumber());
  }

  // Methods
  getCategories(pageNumber: number): void {
    // Making sure the previous subscription is unsubscribed
    this.categorySubscription?.unsubscribe();

    this.categorySubscription = this._categoriesService
      .getAllCategories(this._pageSize.toString(), pageNumber.toString())
      .subscribe((response) => {
        this.displayCategories.set(response.data);
      });
  }
  moveToPage(pageNumber: number): void {
    if (pageNumber < 1) return;
    this.pageNumber.set(pageNumber);
    this.getCategories(pageNumber);
  }

  ngOnDestroy(): void {
    this.categorySubscription?.unsubscribe();
  }
}
