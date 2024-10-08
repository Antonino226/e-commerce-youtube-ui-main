import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { FileHandle } from "../_model/file-handle.model";
import { Category } from "../_model/category.model";
import { CategoryService } from "../_services/category.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-add-category",
  templateUrl: "./add-category.component.html",
  styleUrls: ["./add-category.component.css"],
})
export class AddCategoryComponent implements OnInit {
  isNewCategory = true;
  loading: boolean = false;  // Aggiunta variabile per lo stato di caricamento

  category: Category = {
    categoryId: null,
    categoryName: "",
    categoryDescription: "",
    categoryImages: []
  };

  constructor(
    private categoryService: CategoryService,
    private sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.category = this.activatedRoute.snapshot.data['category'];

    if(this.category && this.category.categoryId) {
      this.isNewCategory = false;
    }
  }

  addCategory(categoryForm: NgForm) {
    this.loading = true; // Attiva l'indicatore di caricamento
    // Verifica se esiste già una categoria con lo stesso nome
    this.categoryService.getCategories().subscribe(
      (categories: Category[]) => {
        const duplicateCategory = categories.find(cat => 
          cat.categoryName.toLowerCase() === this.category.categoryName.toLowerCase()
        );

        if (duplicateCategory && this.isNewCategory) {
          this.snackBar.open('Category name already exists!', 'Close', {
            duration: 3000,
          });
          this.loading = false; // Disattiva l'indicatore di caricamento in caso di duplicato
        } else {
          // Procedi con l'aggiunta della categoria
          const formData = this.prepareFormDataForCategory(this.category);
          this.categoryService.addNewCategory(formData).subscribe(
            (response: Category) => {
              categoryForm.reset();
              this.category.categoryImages = [];
              this.snackBar.open('Category created successfully!', 'Close', {
                duration: 3000,
              });
              this.loading = false; // Disattiva l'indicatore di caricamento in caso di successo
            },
            (error: HttpErrorResponse) => {
              this.snackBar.open('Failed to create category. Please try again.', 'Close', {
                duration: 3000,
              });
              this.loading = false; // Disattiva l'indicatore di caricamento in caso di errore
            }
          );
        }
      },
      (error: HttpErrorResponse) => {
        this.snackBar.open('Failed to fetch categories. Please try again.', 'Close', {
          duration: 3000,
        });
        this.loading = false; // Disattiva l'indicatore di caricamento in caso di errore
      }
    );
  }
  
  prepareFormDataForCategory(category: Category): FormData {
    const uploadImageData = new FormData();
    uploadImageData.append(
      "category",
      new Blob([JSON.stringify(category)], { type: "application/json" })
    );

    for (let i = 0; i < this.category.categoryImages.length; i++) {
      uploadImageData.append(
        "imageFile",
        this.category.categoryImages[i].file,
        this.category.categoryImages[i].file.name
      );
    }
    return uploadImageData;
  }

  onFileSelected(event: any) {
    if (event.target.files) {
      const file = event.target.files[0];
      const fileHandle: FileHandle = {
        file: file,
        url: this.sanitizer.bypassSecurityTrustUrl(
          window.URL.createObjectURL(file)
        ),
      };
      this.category.categoryImages.push(fileHandle);
    }
  }

  removeImages(index: number) {
    this.category.categoryImages.splice(index, 1);
  }

  fileDropped(fileHandle: FileHandle) {
    this.category.categoryImages.push(fileHandle);
  }
}
