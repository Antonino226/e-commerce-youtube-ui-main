import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
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
  currentPage: string;

  constructor(
    private userAuthService: UserAuthService,
    private router: Router,
    public userService: UserService,
    private categoryService: CategoryService,
  ) {}

  ngOnInit(): void {
    this.user = this.userAuthService.getUser();
    this.loadCategories();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Imposta il nome della pagina in base alla rotta corrente
        this.setPageTitle(event.urlAfterRedirects);
      }
    });
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

  setPageTitle(url: string): void {
    if (url.includes('/profile')) {
      this.currentPage = 'Profile';
    } else if (url.includes('/products')) {
      this.currentPage = 'All Products';
    } else if (url.includes('/category')) {
      this.currentPage = 'Categories';
    } else if (url.includes('/cart')) {
      this.currentPage = 'Cart';
    } else if (url.includes('/myOrders')) {
      this.currentPage = 'My Orders';
    } else if (url.includes('/location')) {
      this.currentPage = 'Location';
    } else if (url.includes('/addNewProduct')) {
      this.currentPage = 'Add New Product';
    } else if (url.includes('/addCategory')) {
      this.currentPage = 'Add New Category';
    } else if (url.includes('/addSpecialoffer')) {
      this.currentPage = 'Add Special Offer';
    } else if (url.includes('/orderInformation')) {
      this.currentPage = 'Order Information';
    } else {
      this.currentPage = 'Home'; // Imposta Home come default
    }
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
