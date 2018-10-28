import {Injectable, OnDestroy} from "@angular/core";
import {AuthService} from "./auth.service";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable, Subscription} from "rxjs";

@Injectable()
export class TokenInterceptor implements HttpInterceptor, OnDestroy{
  sub: Subscription;
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(this.authService.isAuthenticated()) {
      this.sub = this.authService.getToken().subscribe(
        (token) => {
          req = req.clone({
            setHeaders: {
              Authorization: token
            }
          })
        }
      )

    }
    return next.handle(req);
  }
  ngOnDestroy() {
    if(this.sub) {
      this.sub.unsubscribe();
    }
  }
}
