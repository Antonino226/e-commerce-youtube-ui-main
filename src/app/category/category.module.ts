import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthGuard } from '../_auth/auth.guard';
import { AddCategoryComponent } from '../add-category/add-category.component';
import { CategoryListComponent } from '../category-list/category-list.component';
import { CategoryResolveService } from '../category-resolve.service';
import { SharedModule } from '../shared.module';


const routes: Routes = [
  {
    path: 'category/:name',
    component: CategoryListComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Admin','User'] },
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
  declarations: [
    CategoryListComponent,
    AddCategoryComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class CategoryModule { }
