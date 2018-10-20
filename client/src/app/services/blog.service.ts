import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

import {Author, Blog, Message} from "../interfaces/interfaces";

@Injectable({
  providedIn: "root"
})
export class BlogService {

  constructor(private http: HttpClient) {}

  getAll(): Observable<Blog[]> {
    return this.http.get<Blog[]>('/api/blogs');
  }
  getById(id: string): Observable<Blog> {
    return this.http.get<Blog>(`/api/blogs/${id}`);
  }
  getByCatId(id: string): Observable<Blog[]> {
    return this.http.get<Blog[]>('/api/blogs',{params: {category: id}});
  }
  createBlog(blog: Blog, image?: File): Observable<Blog> {
    const formData = new FormData();
    if(image) {
      formData.append('mainImage', image, image.name);
    }
    for (let key in blog) {
      formData.append(key, blog[key]);
    }
    return this.http.post<Blog>('/api/blogs', formData);
  }
  updateBlog(blog: Blog, image?: File): Observable<Blog> {
    const formData = new FormData();
    if(image) {
      formData.append('mainImage', image, image.name);
    }
    for (let key in blog) {
      formData.append(key, blog[key]);
    }
    return this.http.patch<Blog>(`/api/blogs/${blog._id}`, formData);
  }
  deleteBlog(id: string): Observable<Message> {
    return this.http.delete<Message>(`/api/blogs/${id}`);
  }

}