import { Component } from '@angular/core';


export interface ManageInstances  {
  name: string;
  url: string;
  urlName: string
}

export interface ShowInstancesOnPage extends ManageInstances{
  show: boolean;
}

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})

export class AdminPageComponent {

  adminActions: ShowInstancesOnPage[] = [
    {name: 'users', url: '/admin/users', urlName: 'автори', show: false},
    {name: 'categories', url: '/admin/categories', urlName: 'теми', show: false},
    {name: 'blogs', url: '/admin/blogs', urlName: 'публікації', show: false},
  ];

  constructor() { }



}
