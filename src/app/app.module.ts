import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { LocationComponent } from './location/location.component';

import { AppRoutingModule } from './app-routing.module';
import { AuthGuard } from './_auth/auth.guard';
import { AuthInterceptor } from './_auth/auth.interceptor';
import { CategoryService } from './_services/category.service';
import { ProductService } from './_services/product.service';
import { UserAuthService } from './_services/user-auth.service';
import { UserService } from './_services/user.service';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { BuyProductResolverService } from './buy-product-resolver.service';
import { CategoryModule } from './category/category.module';
import { ImageProcessingService } from './image-processing.service';
import { ProductModule } from './products/product.module';
import { SharedModule } from './shared.module';
import { SpecialOfferModule } from './special-offer/special-offer.module';
import { UserModule } from './user/user.module';
import { HeaderComponent } from './header/header.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    SharedModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AuthModule,
    AdminModule,
    UserModule,
    CategoryModule,
    ProductModule,
    SpecialOfferModule,
    MatProgressSpinnerModule
  ],
  providers: [
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    UserService,
    CategoryService,
    ProductService,
    UserAuthService,
    BuyProductResolverService,
    ImageProcessingService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
