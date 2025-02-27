import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor(private readonly _httpClient: HttpClient) {}

  getAllCategories(limit?: string, page?: string): Observable<any> {
    let url = `${environment.baseUrl}/api/v1/categories?`;
    if (limit) url += `limit=${limit}&`;
    if (page) url += `page=${page}&`;
    return this._httpClient.get(url);
  }

  getCategoryById(id: string): Observable<any> {
    return this._httpClient.get(
      `https://ecommerce.routemisr.com/api/v1/categories/${id}`,
    );
  }
}
