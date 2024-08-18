import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../_model/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  
  private baseUrl = 'http://localhost:9090/categories';

  constructor(private httpClient: HttpClient) { }

  public getCategories(): Observable<Category[]> {
    return this.httpClient.get<Category[]>(`${this.baseUrl}/getAllCategories`);
  }

  public getCategoryById(id: number): Observable<Category> {
    return this.httpClient.get<Category>(`${this.baseUrl}/getCategoryById/${id}`);
  }

  public addNewCategory(category: FormData): Observable<Category> {
    return this.httpClient.post<Category>(`${this.baseUrl}/addNewCategory`, category);
  }

  public deleteCategories(categoryId: number, deleteProducts: boolean): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/deleteCategory/${categoryId}?deleteProducts=${deleteProducts}`);
  }
  
  public uploadImage(file: File): Observable<string> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    // Make sure to set proper headers if needed, like content-type
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    return this.httpClient.post<string>(`${this.baseUrl}/upload`, formData, { headers: headers });
  }
}
