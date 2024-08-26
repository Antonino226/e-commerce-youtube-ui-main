import { Component, OnInit, OnDestroy } from '@angular/core';
import { Category } from '../_model/category.model';
import { CategoryService } from '../_services/category.service';
import { SafeUrl } from '@angular/platform-browser';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { UserAuthService } from '../_services/user-auth.service';
import { DeleteCategoryDialogComponent } from '../delete-category-dialog/delete-category-dialog.component';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  imageIntervals: { [key: number]: number } = {}; // Store intervals by categoryId
  currentImageIndexes: { [key: number]: number } = {}; // Store current indexes by categoryId
  page: number = 0;
  size: number = 10;
  totalPages: number = 0;
  showLoadButton = false;
  selectedCategories: number[] = [];

  constructor(
    private categoryService: CategoryService,
    private userAuthService: UserAuthService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  ngOnDestroy(): void {
    for (let key in this.imageIntervals) {
      clearInterval(this.imageIntervals[key]);
    }
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(
      (categories: Category[]) => {
        this.categories = categories;
        this.initializeImageRotation(); // Inizializza la rotazione delle immagini dopo il caricamento delle categorie
      },
      (error: HttpErrorResponse) => {
        console.error('Errore nel recupero delle categorie', error);
      }
    );
  }

  private initializeImageRotation(): void {
    this.categories.forEach(category => {
      if (category.categoryImages && category.categoryImages.length > 0) {
        this.currentImageIndexes[category.categoryId] = 0;
        this.imageIntervals[category.categoryId] = window.setInterval(() => {
          this.rotateImages(category.categoryId);
        }, 5000); // Cambia immagine ogni 5 secondi
      }
    });
  }

  private rotateImages(categoryId: number): void {
    const category = this.categories.find(cat => cat.categoryId === categoryId);
    if (category && category.categoryImages && category.categoryImages.length > 0) {
      this.currentImageIndexes[categoryId] = (this.currentImageIndexes[categoryId] + 1) % category.categoryImages.length;
    }
  }

  getCurrentImage(category: Category): SafeUrl {
    if (!category.categoryImages || category.categoryImages.length === 0) {
      return 'src/assets/images/image_2.jpg'; // Immagine predefinita
    }
    const index = this.currentImageIndexes[category.categoryId] || 0;
    return category.categoryImages[index].url; // `url` è già di tipo SafeUrl
  }

  toggleCategorySelection(categoryId: number, isSelected: boolean) {
    if (isSelected) {
      this.selectedCategories.push(categoryId);
    } else {
      this.selectedCategories = this.selectedCategories.filter(id => id !== categoryId);
    }
  }

  deleteSelectedCategories() {
    this.selectedCategories.forEach(categoryId => {
      const dialogRef = this.dialog.open(DeleteCategoryDialogComponent, {
        width: '250px',
        data: { categoryId }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          this.categoryService.deleteCategories(categoryId, result.deleteProducts).subscribe(
            () => {
              this.selectedCategories = this.selectedCategories.filter(id => id !== categoryId);
              this.loadCategories();
            },
            (error: HttpErrorResponse) => {
              console.error(`Errore nell'eliminazione della categoria ${categoryId}:`, error);
            }
          );
        }
      });
    });
  }

  isAdmin() {
    return this.userAuthService.isAdmin();
  }
}
