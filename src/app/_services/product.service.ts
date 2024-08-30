import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderDetails } from '../_model/order-details.model';
import { Order } from '../_model/order.model';
import { Product } from '../_model/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'http://localhost:9090';

  constructor(private httpClient: HttpClient) {}

  public createTransaction(amount: number): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/createTransaction/${amount}`);
  }

  public markAsDelivered(orderId: number): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/markOrderAsDelivered/${orderId}`);
  }

  public getAllOrderDetailsForAdmin(status: string): Observable<Order[]> {
    return this.httpClient.get<Order[]>(`${this.baseUrl}/getAllOrderDetails/${status}`);
  }

  public getMyOrders(): Observable<Order[]> {
    return this.httpClient.get<Order[]>(`${this.baseUrl}/getOrderDetails`);
  }

  public deleteCartItem(cartId: number): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}/deleteCartItem/${cartId}`);
  }

  public addProduct(product: FormData): Observable<Product> {
    return this.httpClient.post<Product>(`${this.baseUrl}/addNewProduct`, product);
  }

  public updateProduct(product: Product): Observable<Product> {
    return this.httpClient.put<Product>(`${this.baseUrl}/updateProduct/${product.productId}`, product);
  }

  public getAllProducts(pageNumber: number, pageSize: number, searchKeyword: string = ""): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.baseUrl}/getAllProducts?pageNumber=${pageNumber}&pageSize=${pageSize}&searchKey=${searchKeyword}`);
  }

  public getProductDetailsById(productId: number): Observable<Product> {
    return this.httpClient.get<Product>(`${this.baseUrl}/getProductDetailsById/${productId}`);
  }

  deleteProduct(productId: number): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}/deleteProductDetails/${productId}`);
  }

  public getProductDetails(isSingleProductCheckout: boolean, productId: number): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.baseUrl}/getProductDetails/${isSingleProductCheckout}/${productId}`);
  }

  public placeOrder(orderDetails: OrderDetails, isCartCheckout: boolean): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/placeOrder/${isCartCheckout}`, orderDetails);
  }

  public addToCart(productId: number): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/addToCart/${productId}`);
  }

  public getCartDetails(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/getCartDetails`);
  }

  public getProductsByCategory(categoryName: string, pageNumber: number, pageSize: number, searchKey: string = ""): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/getProductsByCategory/${categoryName}`, {
        params: {
            pageNumber: pageNumber.toString(),
            pageSize: pageSize.toString(),
            searchKey: searchKey
        }
    });
}
  public getRandomProducts(count: number): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.baseUrl}/getRandomProducts?count=${count}`);
  }
}
