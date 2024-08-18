import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Category } from './_model/category.model';
import { CategoryService } from './_services/category.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryResolveService implements Resolve<Category> {
  constructor(
    private categoryService: CategoryService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Category> {
    const id = Number(route.paramMap.get('categoryId'));

    if (id) {
      // Recupera i dettagli dal backend
      return this.categoryService.getCategoryById(id);
    } else {
      // Restituisce un observable di una categoria vuota.
      return of(this.getEmptyCategory());
    }
  }

  getEmptyCategory(): Category {
    return {
      categoryId: null,
      categoryName: '',
      categoryDescription: '',
      categoryImages: []
    };
  }
}
