import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
@Injectable({
  providedIn: 'root',
})
export class GetOrdersService {
  constructor(private http: HttpClient) {}

  getUserOrders(userId: string): Observable<any> {
    return this.http.get(`${environment.baseUrl}/api/v1/orders/user/${userId}`);
  }
}
