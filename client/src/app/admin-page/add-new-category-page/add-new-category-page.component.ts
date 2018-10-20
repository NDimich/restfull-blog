import {Component, OnDestroy, OnInit} from '@angular/core';
import {AlertMessage, Category} from "../../interfaces/interfaces";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CategoryService} from "../../services/category.service";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {of, Subscription} from "rxjs";
import {switchMap} from "rxjs/operators";


@Component({
  selector: 'app-add-new-category-page',
  templateUrl: './add-new-category-page.component.html',
  styleUrls: ['./add-new-category-page.component.css']
})
export class AddNewCategoryPageComponent implements OnInit, OnDestroy {

  alertMessage: AlertMessage = {message: '', type: ''};
  form: FormGroup;
  newCatSubscription: Subscription[] = [];
  editedCategory: Category;
  isNew = true;
  load = true;

  constructor(private catService: CategoryService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required)
        }
    );
    this.form.disable();
    this.newCatSubscription.push(
        this.route.params.pipe(
            switchMap(
                (params) => {
                  if(params['id']) {
                    return this.catService.getById(params['id']);
                  }
                  return of(null);
                }
            )
        ).subscribe(
            (cat: Category) => {
              if(cat) {
                this.editedCategory = cat;
                this.form.patchValue({
                  name: cat.name
                });
                this.isNew = false;
              }
              this.form.enable();
              this.load = false;
            },
            (error: HttpErrorResponse) => {
              this.alertMessage = {
                message: error.error.message ? error.error.message : 'Виникла помилка, спробуйте пізніше!',
                type: 'warning'
              };
            }
        )
    );
  }

  onSubmit() {
    this.form.disable();
    if(this.isNew) {
      const cat: Category = this.form.value;
      this.newCatSubscription.push(
          this.catService.create(cat).subscribe(
              (data: Category) => {
                this.form.reset({
                  name: ''
                });
                this.router.navigate(['/admin/categories'], {queryParams: {categoryCreated: true}});
              },
              (error: HttpErrorResponse) => {
                this.alertMessage = {
                  message: error.error.message ? error.error.message : 'Виникла помилка',
                  type: 'warning'
                }
              },
              () => {
                this.form.enable();
              }
          )
      );
    } else {
      const newCat: Category = this.form.value;
      newCat._id = this.editedCategory._id;
      this.newCatSubscription.push(
          this.catService.update(newCat).subscribe(
              (cat: Category) => {
                this.router.navigate(['/admin/categories'], {queryParams: {categoryUpdated: true}})
              },
              (error: HttpErrorResponse) => {
                this.alertMessage = {
                  message: error.error.message ? error.error.message : 'Виникла помилка, спробуйте пізніше!',
                  type: 'warning'
                }
              },
              () => {
                this.form.enable();
              }
          )
      );
    }

  }

  closeAlert(alert) {
    alert.style.display = 'none';
  }

  ngOnDestroy(): void {
    this.newCatSubscription.forEach(cat => cat.unsubscribe());
  }

}
