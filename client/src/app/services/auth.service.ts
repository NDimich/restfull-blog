import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {tap} from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // private _author = new Subject<Author | null>();
  private _token = new BehaviorSubject<string | null>(null);
  private _isAdmin = new BehaviorSubject<boolean>(false);



  constructor(private http: HttpClient) { }

  logIn(data: {email, password}): Observable<{token: string, isAdmin: boolean}> {
    return this.http.post<{token: string, isAdmin: boolean}>('/api/auth/login', data).pipe(
      tap(
        (data) => {
          localStorage.setItem('auth-token', data.token);
          this.setToken(data.token);
          this.setAdmin(data.isAdmin);
        },
        (error: HttpErrorResponse) => {
          this.setToken(null);
          this.setAdmin(false);
        }
      )
    );
  }
  logOut() {
    this.setToken(null);
    this.setAdmin(false);
    localStorage.clear();
  }
  private setToken(token: string) {
    this._token.next(token);
  }
  private setAdmin(admin: boolean) {
    this._isAdmin.next(admin)
  }
  getToken(): Observable<string> {
    return this._token;
  }
  getAdmin(): Observable<boolean> {
    return this._isAdmin;
  }
  isAuthenticated(): boolean {
    return !!this._token.value;
  }

}
