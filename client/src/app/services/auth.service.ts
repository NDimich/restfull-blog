import { Injectable } from '@angular/core';
import {Author} from "../interfaces/interfaces";
import {Observable, Subject} from "rxjs";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {tap} from "rxjs/operators";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _author = new Subject<Author | null>();

  constructor(private http: HttpClient, private router: Router) { }

  logIn(data: {email, password}): Observable<any> {
    return this.http.post('/api/auth/login', data).pipe(
      tap(
        (data) => {
          if(data.success) {
            this._author.next(data.author);

          } else {
            this.router.navigate(['/'])
          }
        },
        (error: HttpErrorResponse) => {
          //todo redirect with warning message
          this.router.navigate(['/']);
        }
      )
    );
  }
  logOut() {
    this._author.next(null);
  }
  getCurrentAuthor() {
    return this._author.asObservable();
  }
}
