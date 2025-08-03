import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor(private httpclient: HttpClient) {}

  getCategories(): Observable<any> {
    return this.httpclient.get(`${environment.baseUrl}/api/v1/categories`);
  }
  getSpecificCategories(id: string): Observable<any> {
    return this.httpclient.get(
      `${environment.baseUrl}/api/v1/categories/${id}`
    );
  }
}
