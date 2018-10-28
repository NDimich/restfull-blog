import { Component, OnInit } from '@angular/core';
import {AlertMessage} from "../interfaces/interfaces";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  alertMessage: AlertMessage = {message: '', type: ''};
  load = false;
  form: FormGroup;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(4)])
    })
  }
  onSubmit() {
    this.authService.logIn(this.form.value).subscribe(
      (data) => {
        this.router.navigate(['/'], {queryParams: {loggedIn: true}})
      },
      (error: HttpErrorResponse) => {
        this.alertMessage = {
          message: `Доступ заборонено ${error.error.message}`,
          type: 'warning'
        }
      }
    )
  }

  closeAlert(alert) {
    alert.style.display = 'none';
  }

}
