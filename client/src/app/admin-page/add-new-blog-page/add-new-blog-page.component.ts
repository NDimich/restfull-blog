import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AlertMessage, Author, Blog, Category} from "../../interfaces/interfaces";
import {AngularEditorConfig} from "@kolkov/angular-editor";
import {combineLatest, Subscription} from "rxjs";
import {CategoryService} from "../../services/category.service";
import {AuthorService} from "../../services/author.service";
import {HttpErrorResponse} from "@angular/common/http";
import {BlogService} from "../../services/blog.service";
import {ActivatedRoute, Router} from "@angular/router";
import {switchMap} from "rxjs/internal/operators";

@Component({
  selector: 'app-add-new-blog-page',
  templateUrl: './add-new-blog-page.component.html',
  styleUrls: ['./add-new-blog-page.component.css']
})
export class AddNewBlogPageComponent implements OnInit {

  @ViewChild('image') imageRef: ElementRef;
  load = true;
  isNew = true;
  _id: string = '';
  form: FormGroup;
  image: File;
  categories: Category[] = [];
  authors: Author[] = [];
  imagePreview: string = '';
  alertMessage: AlertMessage = {message: '', type: ''};
  subscription: Subscription[] = [];


  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '25rem',
    minHeight: '5rem',
    placeholder: 'Текст статті має бути тут...',
    translate: 'no',
    uploadUrl: '/uploads', // if needed НАЛАШТУВАТИ!!!!
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


  constructor(private catService: CategoryService,
              private authorService: AuthorService,
              private blogService: BlogService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.subscription.push(
        this.activatedRoute.params.pipe(
            switchMap(
                (params) => {
                  if(params['id']) {
                    return combineLatest(
                        this.blogService.getById(params['id']),
                        this.catService.getAll(),
                        this.authorService.getAll()
                    )
                  } else {
                    return combineLatest(
                        this.catService.getAll(),
                        this.authorService.getAll()
                    )
                  }
                }
            )
        ).subscribe(
            (data: any[]) => {
              if(data.length === 2) {
                this.categories = data[0];
                this.authors = data[1];
                this.initForm();
                this.load = false;
              } else {
                this.categories = data[1];
                this.authors = data[2];
                this.initForm();
                this.form.patchValue({
                  title: data[0].title,
                  subTitle: data[0].subTitle,
                  body: data[0].body,
                  author: this.authors.find(a => a._id === data[0].author)._id,
                  category: this.categories.find(c => c._id === data[0].category)._id
                });
                this._id = data[0]._id;
                this.isNew = false;
                this.image = data[0].mainImage;
                this.imagePreview = data[0].mainImage;
                this.load = false;
              }
              this.form.enable();
            },
            (error: HttpErrorResponse) => {
              this.alertMessage = {
                message: error.error.message ? error.error.message : 'Виникла помилка, спробуйте пізніше.',
                type: 'warning'
              }
            }
        )
    )


  }
  private initForm() {
    this.form = new FormGroup({
      title: new FormControl(null, Validators.required),
      subTitle: new FormControl(null, Validators.required),
      body: new FormControl(null, Validators.required),
      author: new FormControl(null, Validators.required),
      category: new FormControl(null, Validators.required)
    });
  }

  closeAlert(alert) {
    alert.style.display = 'none';
  }

  onSubmit() {
    this.form.disable();
    const blog: Blog = this.form.value;
    blog._id = this._id;
    const mainImage = this.image;
    if(this.isNew) {
      this.subscription.push(
          this.blogService.createBlog(blog, mainImage).subscribe(
              (data: Blog) => {
                this.form.reset({
                  title: '',
                  subTitle: '',
                  body: '',
                  author: '',
                  category: ''
                });
                this.form.enable();
                this.router.navigate(['/admin/blogs'], {queryParams: {blogCreated: true}});
              },
              (error: HttpErrorResponse) => {
                this.alertMessage = {
                  message: error.error.message ? error.error.message : 'Виникла помилка, спробуйте пізніше.',
                  type: 'warning'
                }
              }
          )
      )
    } else {
      this.subscription.push(
          this.blogService.updateBlog(blog, mainImage).subscribe(
              (data: Blog) => {
                this.form.reset({
                  title: '',
                  subTitle: '',
                  body: '',
                  author: '',
                  category: ''
                });
                this.form.enable();
                this.router.navigate(['/admin/blogs'], {queryParams: {blogUpdated: true}});
              },
              (error: HttpErrorResponse) => {
                this.alertMessage = {
                  message: error.error.message ? error.error.message : 'Виникла помилка, спробуйте пізніше.',
                  type: 'warning'
                }
              }
          )
      )
    }
  }

  triggerClick() {
    this.imageRef.nativeElement.click();
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


}
