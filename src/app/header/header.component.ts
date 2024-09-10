import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuthService } from '../_services/user-auth.service';
import { UserService } from '../_services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Category } from '../_model/category.model';
import { CategoryService } from '../_services/category.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {

  categories: Category[] = [];
  category: Category;
  user: any = null; // Per contenere i dati dell'utente

  constructor(
    private userAuthService: UserAuthService,
    private router: Router,
    public userService: UserService,
    private categoryService: CategoryService,
  ) {}

  ngOnInit(): void {
    this.user = this.userAuthService.getUser();
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(
      (categories: Category[]) => {
        this.categories = categories;
      },
      (error: HttpErrorResponse) => {
        console.error('Errore nel recupero delle categorie', error);
      }
    );
  }

  public isLoggedIn() {
    return this.userAuthService.isLoggedIn();
  }

  public logout() {
    this.userAuthService.clear();
    this.router.navigate(['/login']);
  }

  public isAdmin() {
    return this.userAuthService.isAdmin();
  }

  public isUser() {
    return this.userAuthService.isUser();
  }

  public navigateTo(fragment: string) {
    this.router.navigate([], { fragment });
  }

}
