import { BrowserModule } from '@angular/platform-browser';


import { NgModule} from '@angular/core';
import {NgbDropdownModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { AppRoutingModule } from './app-routing.module';
import { HomePageComponent } from './home-page/home-page.component';
import {HttpClientModule} from "@angular/common/http";
import { LoaderComponent } from './shared/loader/loader.component';
import { BlogPageComponent } from './blog-page/blog-page.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { UsersPageComponent } from './admin-page/users-page/users-page.component';
import { CategoriesPageComponent } from './admin-page/categories-page/categories-page.component';
import { BlogsPageComponent } from './admin-page/blogs-page/blogs-page.component';
import { AddNewUserPageComponent } from './admin-page/add-new-user-page/add-new-user-page.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { AddNewCategoryPageComponent } from './admin-page/add-new-category-page/add-new-category-page.component';
import { AddNewBlogPageComponent } from './admin-page/add-new-blog-page/add-new-blog-page.component';
import {AngularEditorModule} from "@kolkov/angular-editor";
import { SetBackgroundImageDirective } from './directives/set-background-image.directive';
import { LoginPageComponent } from './login-page/login-page.component';
import { SignupPageComponent } from './signup-page/signup-page.component';



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomePageComponent,
    LoaderComponent,
    BlogPageComponent,
    AdminPageComponent,
    UsersPageComponent,
    CategoriesPageComponent,
    BlogsPageComponent,
    AddNewUserPageComponent,
    AddNewCategoryPageComponent,
    AddNewBlogPageComponent,
    SetBackgroundImageDirective,
    LoginPageComponent,
    SignupPageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbDropdownModule,
    AngularEditorModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
