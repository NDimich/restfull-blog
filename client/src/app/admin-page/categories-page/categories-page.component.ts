import {Component, OnDestroy, OnInit} from '@angular/core';
import {AlertMessage, Category, Message} from "../../interfaces/interfaces";
import {CategoryService} from "../../services/category.service";
import {HttpErrorResponse} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-categories-page',
  templateUrl: './categories-page.component.html',
  styleUrls: ['./categories-page.component.css']
})
export class CategoriesPageComponent implements OnInit, OnDestroy {

  load: boolean = false;
  categoryToDelete: Category;
  categories: Category[] = [];
  alertMessage: AlertMessage = {message: '', type: ''};
  catSubscription: Subscription[] = [];

  constructor(private catService: CategoryService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private modalService: NgbModal) {
  }

  ngOnInit() {
    this.load = true;
    this.catSubscription.push(
        this.catService.getAll().subscribe(
            (categories: Category[]) => {
              this.categories = categories;
              this.load = false;
            },
            (error: HttpErrorResponse) => {
              this.alertMessage = {
                message: error.error.message ? error.error.message : 'Виникла помилка. Спробуйте пізніше',
                type: 'warning'
              };
              this.load = false;
            }
        )
    );
    this.catSubscription.push(
      this.activatedRoute.queryParams.subscribe(
          (params) => {
            if (params.categoryCreated) {
              this.alertMessage = {
                message: 'Нова тема успішно створена.',
                type: 'success'
              }
            } else if (params.categoryUpdated) {
              this.alertMessage = {
                message: 'Тема успішно оновлена.',
                type: 'success'
              }
            }
          }
        )
    );

  }

  closeAlert(alert) {
    alert.style.display = 'none';
  }

  addCategory() {
    this.router.navigate(['/admin/add-new-category']);
  }

  deleteCategory(category: Category) {
    this.catSubscription.push(
        this.catService.delete(category._id).subscribe(
            (message: Message) => {
              let idx = this.categories.findIndex(cat => cat._id == category._id);
              this.categories.splice(idx, 1);
              this.modalService.dismissAll();
              this.alertMessage = {
                message: message.message,
                type: 'success'
              }
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

  openModal(content, category, event) {
    event.preventDefault();
    this.categoryToDelete = category;
    this.modalService.open(content);
  }

  modalClose() {
    this.modalService.dismissAll();
  }

  ngOnDestroy(): void {
    this.catSubscription.forEach(cat => cat.unsubscribe());
  }

}
