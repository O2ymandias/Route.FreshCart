import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BrandsService {
  constructor(private readonly _httpClient: HttpClient) {}

  getAllBrands(limit?: string, page?: string): Observable<any> {
    let url = `${environment.baseUrl}/api/v1/brands?`;
    if (limit) url += `limit=${limit}&`;
    if (page) url += `page=${page}&`;
    return this._httpClient.get(url);
  }

  
}
