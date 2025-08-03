import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private httpclient: HttpClient) {}

  getProducts(cateID?: string, brandID?: string): Observable<any> {
    let params = new HttpParams();
    if (cateID) {
      params = params.set('category[in]', cateID);
    }
    if (brandID) {
      params = params.set('brand', brandID);
    }
    return this.httpclient.get(`${environment.baseUrl}/api/v1/products`, {
      params,
    });
  }
  getSpecificProduct(id: string): Observable<any> {
    return this.httpclient.get(`${environment.baseUrl}/api/v1/products/${id}`);
  }
}
