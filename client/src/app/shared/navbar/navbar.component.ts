import {Component, OnDestroy, OnInit} from '@angular/core';
import {CategoryService} from "../../services/category.service";
import {Category} from "../../interfaces/interfaces";
import {Subscription} from "rxjs";




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
    {url: '', name: 'головна'},
    {url: '', name: 'теми', children: []},
    {url: '/login', name: 'увійти'},
    {url: '/admin', name: 'адмінка'}
  ];

  constructor(private  categoryService: CategoryService) { }

  ngOnInit() {
    //todo: show menu admin if author is logged in

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
