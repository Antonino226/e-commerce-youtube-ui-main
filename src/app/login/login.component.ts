import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserAuthService } from '../_services/user-auth.service';
import { UserService } from '../_services/user.service';
import { trigger, state, style, transition, animate, query, stagger } from '@angular/animations';
import { HttpErrorResponse } from '@angular/common/http';
import { interval, map } from 'rxjs';
import { Product } from '../_model/product.model';
import { ProductService } from '../_services/product.service';
import { ImageProcessingService } from '../image-processing.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('fade', [ 
      transition('void => *', [
        style({ opacity: 0 }), 
        animate(500, style({opacity: 1}))
      ]) 
    ])
  ]
})
export class LoginComponent implements OnInit {

  userPassword: any;
  userName: any;
  isLogin = true;
  productDetails: Product[] = [];
  selectedProducts: number[] = [];
  showLoadButton = false;
  
  activeIndex = 0;
  activePageIndex = 0;
  pageSize = 5;  // Products per page
  autoScrollInterval: any;
  paginatedProductDetails: Product[][] = [];

  constructor(
    private userService: UserService,
    private productService: ProductService,
    private userAuthService: UserAuthService,
    private imageProcessingService: ImageProcessingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getRandomProducts();
  }

  toggleForm() {
    this.isLogin = !this.isLogin;
  }

  login(loginForm: NgForm) {
    this.userService.login(loginForm.value).subscribe(
      (response: any) => {
        this.userAuthService.setRoles(response.user.role);
        this.userAuthService.setToken(response.jwtToken);
        this.userAuthService.setUser(response.user);
  
        const role = response.user.role[0].roleName;
        if (role === 'Admin') {
          this.router.navigate(['/home']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      (error) => {
        console.error('Login error', error);
      }
    );
  }

  register(registerForm: NgForm) {
    this.userService.register(registerForm.value).subscribe(
      (response) => {
        this.router.navigate(['/login']);
      },
      (error) => {
        
      }
    );
  }

  registerUser() {
    this.router.navigate(['/register']);
  }

  getRandomProducts(count: number = 10) {
    this.productService.getRandomProducts(count)
      .pipe(
        map((products: Product[]) => products.map(product => this.imageProcessingService.createImagesProduct(product)))
      )
      .subscribe(
        (products: Product[]) => {
          this.productDetails.push(...products);
        },
        (error: HttpErrorResponse) => {
          console.error('Error fetching random products:', error);
        }
      );
  }

  paginateProducts() {
    for (let i = 0; i < this.productDetails.length; i += this.pageSize) {
      this.paginatedProductDetails.push(this.productDetails.slice(i, i + this.pageSize));
    }
  }

  startAutoScroll() {
    this.autoScrollInterval = interval(3000).subscribe(() => {
      this.nextProduct();
    });
  }

  nextProduct() {
    this.activeIndex = (this.activeIndex + 1) % this.pageSize;
    if (this.activeIndex === 0) {
      this.nextPage();
    }
  }

  nextPage() {
    this.activePageIndex = (this.activePageIndex + 1) % this.paginatedProductDetails.length;
  }

  setPage(index: number) {
    this.activePageIndex = index;
    this.activeIndex = 0;
  }

  ngOnDestroy() {
    if (this.autoScrollInterval) {
      this.autoScrollInterval.unsubscribe();
    }
  }
  
}