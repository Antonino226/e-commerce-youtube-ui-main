import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from './_model/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = 'api/orders';

  constructor(private http: HttpClient) {}

  createOrder(orderData: any): Observable<Order> {
    return this.http.post<Order>(`${this.baseUrl}/create`, orderData);
  }
}
