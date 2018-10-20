import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Category, Message} from "../interfaces/interfaces";

@Injectable({
  providedIn: "root"
})
export class CategoryService {

  constructor(private http: HttpClient) {}

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>('/api/categories');
  }
  getById(id: string): Observable<Category>{
    return this.http.get<Category>(`/api/categories/${id}`);
  }
  create(category: Category): Observable<Category> {
    return this.http.post<Category>('/api/categories', category);
  }
  delete(id: string): Observable<Message> {
    return this.http.delete<Message>(`/api/categories/${id}`);
  }
  update(category: Category): Observable<Category> {
    return this.http.patch<Category>(`/api/categories/${category._id}`, category);
  }
}