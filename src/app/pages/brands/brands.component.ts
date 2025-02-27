import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { BrandsService } from '../../core/services/brands.service';
import { IBrand } from '../../shared/interfaces/ibrand';
import { PaginationComponent } from "../../shared/components/pagination/pagination.component";

@Component({
  selector: 'app-brands',
  imports: [PaginationComponent],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss',
})
export class BrandsComponent implements OnInit {
  private readonly _brandsService: BrandsService = inject(BrandsService);
  displayBrands: WritableSignal<IBrand[]> = signal([]);
  pageNumber: WritableSignal<number> = signal(1);
  pageSize: WritableSignal<number> = signal(10);

  ngOnInit(): void {
    this.getBrands(this.pageNumber());
  }

  getBrands(pageNumber: number): void {
    this._brandsService
      .getAllBrands(this.pageSize().toString(), pageNumber.toString())
      .subscribe((response) => {
        this.displayBrands.set(response.data);
      });
  }
  moveToPage(pageNumber: number): void {
    if (pageNumber < 1) return;
    this.pageNumber.set(pageNumber);
    this.getBrands(pageNumber);
  }
}
