import {Component, OnDestroy, OnInit} from '@angular/core';
import {CategoryService} from "../../services/category.service";
import {Category} from "../../interfaces/interfaces";
import {combineLatest, Subscription} from "rxjs";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  show = false;
  showDropdown = false;
  timeoutId: any;
  subscription: Subscription[] = [];

  links = [
    {url: '', name: 'головна', display: true},
    {url: '', name: 'теми', children: [], display: true},
    {url: '/login', name: 'увійти', display: true},
    {url: '/admin', name: 'адмінка', display: false},
    {url: '/logout', name: 'вийти', display: false}
  ];


  constructor(private  categoryService: CategoryService, private authService: AuthService) { }

  ngOnInit() {
    this.subscription.push(
        this.categoryService.getAll().subscribe(
            (data: Category[]) => {
              data.map(
                  (d: Category) => {
                    this.links[1]['children'].push(
                        {url: '/blogs', queryParam: d._id, name: d.name}
                    )
                  }
              );
            }
        )
    );

    this.subscription.push(
      combineLatest(
        this.authService.getToken(),
        this.authService.getAdmin()
      ).subscribe(
        (data: [string, boolean]) => {
          if(data[0] !== null && data[1] !== null) {
            this.links.find(v => v.url === '/login').display = false;
            this.links.find(v => v.url === '/admin').display = true;
            this.links.find(v => v.url === '/logout').display = true;
          }
          else if(data[0] === null && data[1] === false) {
            this.links.find(v => v.url === '/logout').display = false;
            this.links.find(v => v.url === '/admin').display = false;
            this.links.find(v => v.url === '/login').display = true;
          }

        }
      )
    );



  }
  ngOnDestroy(): void {
    this.subscription.forEach(sub => sub.unsubscribe())
  }
  showMenu(event) {
    event.preventDefault();
    this.showDropdown = true;
    clearTimeout(this.timeoutId);
  }
  hideMenu(){
    this.timeoutId = setTimeout(() => {
      this.showDropdown = false;
    }, 1000)
  }




}
