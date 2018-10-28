import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {HomePageComponent} from "./home-page/home-page.component";
import {BlogPageComponent} from "./blog-page/blog-page.component";
import {AdminPageComponent} from "./admin-page/admin-page.component";
import {UsersPageComponent} from "./admin-page/users-page/users-page.component";
import {CategoriesPageComponent} from "./admin-page/categories-page/categories-page.component";
import {BlogsPageComponent} from "./admin-page/blogs-page/blogs-page.component";
import {AddNewUserPageComponent} from "./admin-page/add-new-user-page/add-new-user-page.component";
import {AddNewCategoryPageComponent} from "./admin-page/add-new-category-page/add-new-category-page.component";
import {AddNewBlogPageComponent} from "./admin-page/add-new-blog-page/add-new-blog-page.component";
import {LoginPageComponent} from "./login-page/login-page.component";
import {SignupPageComponent} from "./signup-page/signup-page.component";
import {LogoutPageComponent} from "./logout-page/logout-page.component";
import {AuthGuard} from "./services/auth.guard";

const routes: Routes = [
  {path: '', component: HomePageComponent},
  {path: 'login', component: LoginPageComponent},
  {path: 'logout', component: LogoutPageComponent},
  {path: 'signup', component: SignupPageComponent},
  {path: 'blogs/:id', component: BlogPageComponent},
  {path: 'blogs',component: HomePageComponent},
  {path: 'admin', component: AdminPageComponent, canActivate: [AuthGuard], children: [
      {path: 'users', component: UsersPageComponent},
      {path: 'categories', component: CategoriesPageComponent},
      {path: 'categories/:id', component: AddNewCategoryPageComponent},
      {path: 'blogs', component: BlogsPageComponent},
      {path: 'blogs/:id', component: AddNewBlogPageComponent},
      {path: 'add-new-author', component: AddNewUserPageComponent},
      {path: 'users/:id', component: AddNewUserPageComponent},
      {path: 'add-new-category', component: AddNewCategoryPageComponent},
      {path: 'add-new-blog', component: AddNewBlogPageComponent}
    ]}


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports:[
    RouterModule
  ],
  declarations: []
})
export class AppRoutingModule { }
