import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../_auth/auth.guard';
import { AddCategoryComponent } from '../add-category/add-category.component';
import { CategoryListComponent } from '../category-list/category-list.component';
import { CategoryResolveService } from '../category-resolve.service';


const routes: Routes = [
  {
    path: 'category/:name',
    component: CategoryListComponent
  },
  {
    path: 'addCategory',
    component: AddCategoryComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Admin'] },
    resolve: { category: CategoryResolveService }
  }
];

@NgModule({
  declarations: [CategoryListComponent, AddCategoryComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class CategoryModule { }
