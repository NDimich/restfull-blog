import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";

import {AuthorService} from "../../services/author.service";
import {AlertMessage, Author, Message} from "../../interfaces/interfaces";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.css']
})
export class UsersPageComponent implements OnInit, OnDestroy {

  authors: Author[];
  load = true;
  userPageSubscriptions: Subscription[] = [];
  alertMessage: AlertMessage = {message: '', type: ''};
  authorToDelete: Author;


  constructor(private router: Router,
              private authorService: AuthorService,
              private route: ActivatedRoute, private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.userPageSubscriptions.push(
        this.authorService.getAll().subscribe(
            (data: Author[]) => {
              this.authors = data;
              this.load = false;
            },
            (error: HttpErrorResponse) => {
              this.alertMessage ={
                message: error.error.message ? error.error.message  : 'Виникла помилка. Спробуйте пізніше',
                type: 'warning'
              };
              this.load = false;
            }
        )
    );
    this.userPageSubscriptions.push(
        this.route.queryParams.subscribe(
            (params) => {
              if (params['userCreated']) {
                this.alertMessage.message = 'Нового автора успішно додано!';
                this.alertMessage.type = 'success';
              } else if(params['userUpdated']) {
                this.alertMessage.message = 'Дані автора успішно оновленні!';
                this.alertMessage.type = 'success';
              }
            }
        )
    );

  }

  addAuthor() {
    this.router.navigate(['/admin/add-new-author']);
  }

  closeAlert(alert) {
    alert.style.display = 'none';
  }

  ngOnDestroy(): void {
    this.userPageSubscriptions.forEach(sub => sub.unsubscribe())
  }

  openModal(content, author, event) {
    event.preventDefault();
    this.authorToDelete = author;
    this.modalService.open(content, {size: 'lg'});
  }
  modalClose() {
    this.modalService.dismissAll();
  }
  deleteAuthor(author: Author) {
    this.userPageSubscriptions.push(
      this.authorService.deleteAuthor(author._id).subscribe(
        (message: Message) => {
          let idx = this.authors.findIndex((a) => a._id === author._id);
          this.authors.splice(idx, 1);
          this.alertMessage.message = message.message;
          this.alertMessage.type = 'success';
          this.modalService.dismissAll();
        },
          (error: HttpErrorResponse) => {
          this.alertMessage.message = error.error.message;
          this.alertMessage.type = 'warning';
          this.modalService.dismissAll();
          }
      )
    )
  }
}
