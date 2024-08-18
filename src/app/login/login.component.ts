import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserAuthService } from '../_services/user-auth.service';
import { UserService } from '../_services/user.service';
import { trigger, state, style, transition, animate, query, stagger } from '@angular/animations';
import { HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs';
import { Product } from '../_model/product.model';
import { ProductService } from '../_services/product.service';
import { ImageProcessingService } from '../image-processing.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('fadeSlideInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('500ms ease-in', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('500ms ease-out', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ]),
    trigger('listAnimation', [
      transition('* <=> *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(-15px)' }),
          stagger('50ms', [
            animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true }),
        query(':leave', [
          animate('500ms', style({ opacity: 0, transform: 'translateY(-15px)' }))
        ], { optional: true })
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

        const role = response.user.role[0].roleName;
        if (role === 'Admin') {
          this.router.navigate(['/home']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      (error) => {
        
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

  getRandomProducts(count: number = 5) {
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
}