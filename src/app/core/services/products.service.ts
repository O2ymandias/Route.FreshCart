import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { IProductsFiltrationOptions } from '../../shared/interfaces/iproducts-filtration-options';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private readonly _httpClient: HttpClient) {}

  getAllProducts(options?: IProductsFiltrationOptions): Observable<any> {
    let url = `${environment.baseUrl}/api/v1/products?`;
    if (options) {
      if (options.pageNumber) url += `page=${options.pageNumber}&`;
      if (options.limit) url += `limit=${options.limit}&`;
      if (options.minPrice) url += `price[gte]=${options.minPrice}&`;
      if (options.maxPrice) url += `price[lte]=${options.maxPrice}&`;
      if (options.brandId) url += `brand=${options.brandId}&`;
      if (options.categoriesIds) {
        for (let i = 0; i < options.categoriesIds.length; i++) {
          url += `category[${i}]=${options.categoriesIds[i]}&`;
        }
      }
      if (options.sort) url += `sort=${options.sort}&`;
    }
    return this._httpClient.get(url);
  }

  getSpecificProduct(id: string): Observable<any> {
    return this._httpClient.get(
      `https://ecommerce.routemisr.com/api/v1/products/${id}`,
    );
  }
}
