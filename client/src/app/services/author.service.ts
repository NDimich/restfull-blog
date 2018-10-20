import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Author, Message} from "../interfaces/interfaces";

@Injectable({
  providedIn: "root"
})
export class AuthorService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Author[]> {
    return this.http.get<Author[]>('/api/authors');
  }
  getByEmail(email): Observable<Author[]> {
    return this.http.get<Author[]>(`/api/authors`, {params: {'email': email}})
  }
  getById(id: string): Observable<Author[]> {
    return this.http.get<Author[]>(`/api/authors/${id}`);
  }
  createAuthor(author: Author, photo?: File): Observable<Author> {
    const formData = new FormData();
    if(photo) {
      formData.append('photo', photo, photo.name);
    }
    for (let key in author) {
      formData.append(key, author[key]);
    }
    return this.http.post<Author>('/api/authors', formData);
  }
  deleteAuthor(id: string): Observable<Message> {
    return this.http.delete<Message>(`/api/authors/${id}`);
  }
  updateAuthor(author: Author, photo?: File): Observable<Author> {
    const formData = new FormData();
    if(photo) {
      formData.append('photo', photo, photo.name);
    }
    for (let key in author) {
      formData.append(key, author[key]);
    }
    return this.http.patch<Author>(`api/authors/${author._id}`, formData);
  }

}
