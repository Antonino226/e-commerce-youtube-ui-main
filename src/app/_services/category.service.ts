import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { Category } from '../_model/category.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ImageProcessingService } from '../image-processing.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categories: Category[] = [];
  private categoriesLoaded: boolean = false;

  private baseUrl = 'http://localhost:9090/categories';

  constructor(
    private imageProcessingService: ImageProcessingService,
    private httpClient: HttpClient,
  ) {}

  /**
   * Recupera le categorie dalla cache se disponibili, altrimenti le recupera dal server.
   * @returns Observable<Category[]> - Le categorie.
   */
  public getCategories(): Observable<Category[]> {
    if (this.categoriesLoaded) {
      return of(this.categories);
    } else {
      return this.httpClient.get<Category[]>(`${this.baseUrl}/getAllCategories`).pipe(
        map((categories: Category[]) => {
          // Processa le immagini per le categorie
          categories = categories.map(category => 
            this.imageProcessingService.createImagesCategory(category)
          );
          this.categories = categories;
          this.categoriesLoaded = true;
          return categories;
        }),
        catchError(this.handleError<Category[]>('getCategories', []))
      );
    }
  }

  /**
   * Recupera una singola categoria per ID.
   * @param id - L'ID della categoria da recuperare.
   * @returns Observable<Category> - La categoria.
   */
  public getCategoryById(id: number): Observable<Category> {
    return this.httpClient.get<Category>(`${this.baseUrl}/getCategoryById/${id}`).pipe(
      map(category => this.imageProcessingService.createImagesCategory(category)),
      catchError(this.handleError<Category>('getCategoryById'))
    );
  }

  /**
   * Aggiunge una nuova categoria.
   * @param category - La categoria da aggiungere, inclusa l'immagine come FormData.
   * @returns Observable<Category> - La categoria aggiunta.
   */
  public addNewCategory(category: FormData): Observable<Category> {
    return this.httpClient.post<Category>(`${this.baseUrl}/addNewCategory`, category).pipe(
      map((newCategory: Category) => {
        newCategory = this.imageProcessingService.createImagesCategory(newCategory);
        this.categories.push(newCategory); // Aggiorna la cache
        return newCategory;
      }),
      catchError(this.handleError<Category>('addNewCategory'))
    );
  }

  /**
   * Elimina una categoria e, opzionalmente, i prodotti associati.
   * @param categoryId - L'ID della categoria da eliminare.
   * @param deleteProducts - Flag per eliminare anche i prodotti associati.
   * @returns Observable<void> - Completamento dell'operazione.
   */
  public deleteCategories(categoryId: number, deleteProducts: boolean): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/deleteCategory/${categoryId}?deleteProducts=${deleteProducts}`).pipe(
      map(() => {
        this.categories = this.categories.filter(category => category.categoryId !== categoryId); // Aggiorna la cache
      }),
      catchError(this.handleError<void>('deleteCategories'))
    );
  }

  /**
   * Carica un'immagine e restituisce un SafeUrl.
   * @param file - Il file dell'immagine da caricare.
   * @returns Observable<string> - L'URL dell'immagine caricata.
   */
  public uploadImage(file: File): Observable<string> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    // Imposta correttamente gli headers
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    return this.httpClient.post<string>(`${this.baseUrl}/upload`, formData, { headers: headers });
  }

  /**
   * Gestisce gli errori delle chiamate HTTP.
   * @param operation - Nome dell'operazione fallita.
   * @param result - Risultato predefinito da restituire in caso di errore.
   * @returns Function - Funzione di gestione degli errori.
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
