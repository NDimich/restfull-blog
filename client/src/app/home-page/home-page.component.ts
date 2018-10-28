import {Component, OnDestroy, OnInit} from '@angular/core';
import {BlogService} from "../services/blog.service";
import {Subscription} from "rxjs";
import {AlertMessage, Blog} from "../interfaces/interfaces";


import {ActivatedRoute} from "@angular/router";
import {switchMap} from "rxjs/internal/operators";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit, OnDestroy {

  blogs: Blog[] = [];
  load = true;
  alertMessage: AlertMessage = {message: '', type: ''};
  subscription: Subscription[] = [];

  constructor(private blogService: BlogService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.subscription.push(
        this.activatedRoute.queryParams.pipe(
            switchMap(
                (params) => {
                  if(params['category']) {
                    return  this.blogService.getByCatId(params['category']);
                  } else if(params['userCreated']) {
                    this.alertMessage = {
                      message: 'Заявку успішно подано. Чекайте на відповідь.',
                      type: 'success'
                    };
                    return this.blogService.getAll();
                  } else if(params['loggedIn']) {
                    this.alertMessage = {
                      message: 'Ви увійшли на сайт.',
                      type: 'success'
                    };
                    return this.blogService.getAll();
                  } else if(params['accessDenied']) {
                    this.alertMessage = {
                      message: 'Доступ заборонено. Авторизуйтесь.',
                      type: 'warning'
                    };
                    return this.blogService.getAll();
                  } else {
                    return this.blogService.getAll();
                  }
                }
            )
        ).subscribe(
            (data: Blog[]) => {
              this.blogs = data;
              this.load = false;
            },
            (error: HttpErrorResponse) => {
              this.alertMessage = {
                message: error.error.message ?  error.error.message : 'Виникла помилка. Спробуйте пізніше.',
                type: 'warning'
              };
              this.load = false;
            }
        )
    );

  }
  ngOnDestroy(): void {
    this.subscription.forEach(sub => sub.unsubscribe());
  }
  closeAlert(alert) {
    alert.style.display = 'none';
  }

}
