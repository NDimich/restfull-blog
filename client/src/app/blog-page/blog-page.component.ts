import {Component, OnDestroy, OnInit} from '@angular/core';
import {BlogService} from "../services/blog.service";
import {of, Subscription} from "rxjs";
import {AlertMessage, Blog} from "../interfaces/interfaces";
import {ActivatedRoute, Params, Router} from "@angular/router";
import { switchMap} from "rxjs/operators";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-blog-page',
  templateUrl: './blog-page.component.html',
  styleUrls: ['./blog-page.component.css']
})
export class BlogPageComponent implements OnInit, OnDestroy {

  blog: Blog;
  alertMessage: AlertMessage = {message: '', type: ''};
  subscription: Subscription[] = [];

  constructor(private blogService: BlogService,
              private activatedRoute: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.subscription.push(
        this.activatedRoute.params.pipe(
            switchMap(
                (params: Params) => {
                  if(params['id']) {
                    return this.blogService.getById(params['id'])
                  } else {
                    this.router.navigate(['/']);
                    return of(null);
                  }
                }
            )
        ).subscribe(
            (blog: Blog) => {
              this.blog = blog;
            },
            (error: HttpErrorResponse) => {
              this.alertMessage = {
                message: error.error.message ? error.error.message : 'Виникла помилка, спробуйте пізніше.',
                type: 'warning'
              }
            }
        )
    );

  }
  ngOnDestroy(): void {
    this.subscription.forEach(sub => sub.unsubscribe());
  }
  closeAlert(alert) {
    alert.nativeElement.display = 'none';
  }

}
