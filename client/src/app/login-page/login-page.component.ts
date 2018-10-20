import { Component, OnInit } from '@angular/core';
import {AlertMessage} from "../interfaces/interfaces";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  alertMessage: AlertMessage = {message: '', type: ''};
  load = false;
  form: FormGroup;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(4)])
    })
  }
  onSubmit() {
    this.authService.logIn(this.form.value).subscribe(
      (data) => {
        console.log(data);
        //todo redirect with success message to page where user have been
      },
      (error: HttpErrorResponse) => {
        //todo show error alert
      }
    )
  }

  closeAlert(alert) {
    alert.style.display = 'none';
  }

}
