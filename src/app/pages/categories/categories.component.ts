import { Component, inject, signal, WritableSignal } from '@angular/core';
import { CategoriesService } from '../../core/services/categories.service';
import { ICategory } from '../../shared/interfaces/icategory';
import { PaginationComponent } from "../../shared/components/pagination/pagination.component";
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-categories',
  imports: [PaginationComponent, TranslatePipe],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent {
  private readonly _categoriesService: CategoriesService =
    inject(CategoriesService);
  displayCategories: WritableSignal<ICategory[]> = signal([]);
  pageNumber: WritableSignal<number> = signal(1);
  pageSize: WritableSignal<number> = signal(5);

  ngOnInit(): void {
    this.getCategories(this.pageNumber());
  }

  getCategories(pageNumber: number): void {
    this._categoriesService
      .getAllCategories(this.pageSize().toString(), pageNumber.toString())
      .subscribe((response) => {
        this.displayCategories.set(response.data);
      });
  }
  moveToPage(pageNumber: number): void {
    if (pageNumber < 1) return;
    this.pageNumber.set(pageNumber);
    this.getCategories(pageNumber);
  }
}
