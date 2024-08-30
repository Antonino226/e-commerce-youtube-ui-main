import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../_auth/auth.guard';
import { AddCategoryComponent } from '../add-category/add-category.component';
import { CategoryListComponent } from '../category-list/category-list.component';
import { CategoryResolveService } from '../category-resolve.service';

const routes: Routes = [
  {
    path: 'category/:name',
    component: CategoryListComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Admin'] },
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
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryRoutingModule { }
