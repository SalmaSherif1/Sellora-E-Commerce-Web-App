import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { url } from 'inspector';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private httpClient: HttpClient) {}

  cashOrder(id: string, shippingData: object): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/api/v1/orders/${id}`, {
      shippingAddress: shippingData,
    });
  }

  checkoutsession(id: string, shippingData: object): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}/api/v1/orders/checkout-session/${id}?url=${window.location.origin}`,
      {
        shippingAddress: shippingData,
      }
    );
  }
}
