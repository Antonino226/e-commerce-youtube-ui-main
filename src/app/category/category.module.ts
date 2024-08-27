import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthGuard } from '../_auth/auth.guard';
import { AddCategoryComponent } from '../add-category/add-category.component';
import { CategoryListComponent } from '../category-list/category-list.component';
import { CategoryResolveService } from '../category-resolve.service';
import { SharedModule } from '../shared.module';
import { CategoryRoutingModule } from './category-routing.module';
import { DeleteCategoryDialogComponent } from '../delete-category-dialog/delete-category-dialog.component';

@NgModule({
  declarations: [
    CategoryListComponent,
    AddCategoryComponent,
    DeleteCategoryDialogComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CategoryRoutingModule
  ]
})
export class CategoryModule { }
