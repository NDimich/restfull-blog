import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AlertMessage, Author} from "../interfaces/interfaces";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AngularEditorConfig} from "@kolkov/angular-editor";
import {AuthorService} from "../services/author.service";
import {debounceTime, distinct, distinctUntilChanged, mergeAll, mergeMap, take} from "rxjs/operators";
import {fromEvent, Observable, of} from "rxjs";

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.css']
})
export class SignupPageComponent implements OnInit {

  @ViewChild('authorPhoto') photoRef: ElementRef;

  imagePreview: string = '';
  image: File;
  password: string;
  passwordMatch: boolean = true;

  alertMessage: AlertMessage = {message: '', type: ''};
  load = false;
  form: FormGroup;

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '25rem',
    minHeight: '5rem',
    placeholder: 'Коротко про себе...',
    translate: 'no',
    //uploadUrl: '/uploads', // if needed НАЛАШТУВАТИ!!!!
    customClasses: [ // optional
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };

  constructor(private authorService: AuthorService) { }

  ngOnInit() {
    this.form = new FormGroup({
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required,
                                                            Validators.email], this.emailExist.bind(this)),
      password: new FormControl(null, [Validators.required, Validators.minLength(4)]),
      about: new FormControl(null, [Validators.required, Validators.maxLength(1000)])
    });

  }
  getPasswordValue(event) {
    this.password = event.target.value;
  }
  checkPassword(event) {
    this.passwordMatch = event.target.value === this.password;
  }
  // todo: combine operators for 1 request, now send for every symbol after @!
  emailExist(email: FormControl): Promise<any> {
    return new Promise<any>((resolve) => {
      email.valueChanges.pipe(
        distinctUntilChanged(),
        debounceTime(1500),
        mergeMap(
          (value: any) => this.authorService.getByEmail(value)
        )
      ).subscribe(
        (data) => {
          console.log(data);
          if (data.length > 0) {
            resolve({emailExist: true})
          } else {
            resolve(null)
          }
        }
      )
    })
    /*return new Promise<any>((resolve) => {

      this.authorService.getByEmail(email.value).subscribe(
        (author: Author[]) => {
          if(author.length > 0) {
            resolve({emailExist: true})
          } else {
            resolve(null)
          }
        }
      )
    })*/
  }
  onSubmit() {
    console.log(this.form)
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

}
