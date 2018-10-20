import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {of, Subscription} from "rxjs";

import {AlertMessage, Author} from "../../interfaces/interfaces";
import {AuthorService} from "../../services/author.service";
import {switchMap} from "rxjs/operators";


@Component({
  selector: 'app-add-new-user-page',
  templateUrl: './add-new-user-page.component.html',
  styleUrls: ['./add-new-user-page.component.css']
})

export class AddNewUserPageComponent implements OnInit, OnDestroy {

  @ViewChild('authorPhoto') photoRef: ElementRef;
  load = true;
  imagePreview: string = '';
  image: File;
  form: FormGroup;
  isNew = true;
  alertMessage: AlertMessage = {message: '', type: ''};
  addNewUserSubscription: Subscription[] = [];
  editedAuthor: Author;

  constructor(private authorService: AuthorService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(4)])
    });
    this.form.disable();
    this.addNewUserSubscription.push(
        this.route.params.pipe(
            switchMap(
                (params) => {
                  if(params['id']) {
                    return this.authorService.getById(params['id']);
                  }
                  return of(null);
                }
            )
        ).subscribe(
            (author: Author) => {
              if(author) {
                this.editedAuthor = author;
                this.form.patchValue({
                  firstName: author.firstName.toUpperCase(),
                  lastName: author.lastName.toUpperCase(),
                  email: author.email
                });
                this.imagePreview = author.photo;
                this.isNew = false;
              }
              this.form.enable();
              this.load = false;
            },
            (error: HttpErrorResponse) => {
              this.alertMessage ={
                message: error.error.message ? error.error.message : 'Виникла помилка, спробуйте пізніше.',
                type: 'warning'
              }
            }
        )
    )

  }

  onSubmit() {
    this.form.disable();
    if(this.isNew) {
      const author: Author = this.form.value;
      const photo = this.image;
      this.addNewUserSubscription.push(
          this.authorService.createAuthor(author, photo).subscribe(
              (data: Author) => {
                this.form.reset({
                  firstName: '',
                  lastName: '',
                  email: ''
                });
                this.form.enable();
                this.router.navigate(['/admin/users'], {queryParams: {userCreated: true}});
              },
              (error: HttpErrorResponse) => {
                this.alertMessage ={
                  message: error.error.message ? error.error.message : 'Виникла помилка, спробуйте пізніше.',
                  type: 'warning'
                }
              }
          )
      )
    } else {
      const author: Author = this.form.value;
      const photo = this.image;
      author._id = this.editedAuthor._id;
      this.addNewUserSubscription.push(
          this.authorService.updateAuthor(author, photo).subscribe(
              (newAuthor: Author) => {
                this.form.reset({
                  firstName: '',
                  lastName: '',
                  email: ''
                });
                this.form.enable();
                this.router.navigate(['/admin/users'], {queryParams: {userUpdated: true}});
              },
              (error: HttpErrorResponse) => {
                this.alertMessage ={
                  message: error.error.message ? error.error.message : 'Виникла помилка, спробуйте пізніше.',
                  type: 'warning'
                }
              }
          )
      )
    }

  }
  triggerClick() {
    this.photoRef.nativeElement.click();
  }

  uploadImage(event: any) {
    const file = event.target.files[0];
    this.image = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);

  }

  closeAlert(alert) {
    alert.style.display = 'none';
  }

  ngOnDestroy(): void {
    this.addNewUserSubscription.forEach(sub => sub.unsubscribe());
  }

}
