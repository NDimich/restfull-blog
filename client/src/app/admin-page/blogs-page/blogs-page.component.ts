import {Component, OnDestroy, OnInit} from '@angular/core';
import {AlertMessage, Blog, Message} from "../../interfaces/interfaces";
import {BlogService} from "../../services/blog.service";
import {Subscription} from "rxjs/index";
import {HttpErrorResponse} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-blogs-page',
  templateUrl: './blogs-page.component.html',
  styleUrls: ['./blogs-page.component.css']
})
export class BlogsPageComponent implements OnInit, OnDestroy {

  load = false;
  blogs: Blog[];
  blogsSubscription: Subscription[] = [];
  alertMessage: AlertMessage = {message: '', type: ''};
  blogToDelete: Blog;


  constructor(private blogService: BlogService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private modalService: NgbModal) { }

  ngOnInit() {
    this.load = true;
    this.blogsSubscription.push(
      this.blogService.getAll().subscribe(
          (blogs: Blog[]) => {
            this.blogs = blogs;
            this.load = false;
          },
          (error: HttpErrorResponse) => {
            this.alertMessage = {
              message: error.error.message ? error.error.message : 'Виникла помилка, спробуйте пізніше.',
              type: 'warning'
            };
            this.load = false;
          }
      )
    );
    this.blogsSubscription.push(
        this.activatedRoute.queryParams.subscribe(
            (params) => {
              if(params['blogCreated']) {
                this.alertMessage = {
                  message: 'Нова публікація успішно створена',
                  type: 'success'
                }
              } else if(params['blogUpdated']) {
                this.alertMessage = {
                  message: 'Публікація успішно оновлена',
                  type: 'success'
                }
              }
            }
        )
    )
  }

  closeAlert(alert){
    alert.style.display = 'none';
  }
  openModal(content, blog, event){
    event.preventDefault();
    this.modalService.open(content);
    this.blogToDelete = blog;

  }
  addBlog(){
    this.router.navigate(['/admin/add-new-blog']);
  }
  modalClose(){
    this.modalService.dismissAll();
  }
  deleteBlog(blog){
    this.blogsSubscription.push(
        this.blogService.deleteBlog(blog._id).subscribe(
            (data: Message) => {
              let idx = this.blogs.findIndex(b => b._id === blog._id);
              this.blogs.splice(idx, 1);
              this.alertMessage = {
                message: data.message,
                type: 'success'
              };
              this.modalService.dismissAll();
            },
            (error: HttpErrorResponse) => {
              this.alertMessage = {
                message: error.error.message ? error.error.message : 'Виникла помилка. Спробуйте пізніше.',
                type: 'warning'
              };
              this.modalService.dismissAll();
            }
        )
    );

  }
  ngOnDestroy(): void {
    this.blogsSubscription.forEach(sub => sub.unsubscribe());
  }
}
