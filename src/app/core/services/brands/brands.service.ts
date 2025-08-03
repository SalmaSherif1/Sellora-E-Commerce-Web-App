import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
@Injectable({
  providedIn: 'root',
})
export class BrandsService {
  constructor(private httpclient: HttpClient) {}

  getBrands(): Observable<any> {
    return this.httpclient.get(`${environment.baseUrl}/api/v1/brands`);
  }
  getSpecificBrand(id: string): Observable<any> {
    return this.httpclient.get(`${environment.baseUrl}/api/v1/brands/${id}`);
  }
}
