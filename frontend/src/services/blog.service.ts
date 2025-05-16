import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BlogPost {
  postId: number;
  title: string;
  author: string;
  content: string;
  dateCreated: string;
  Tags: string[];
}

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  private apiUrl = 'http://localhost:8080/api/posts';

  constructor(private http: HttpClient) { }

  getPosts(): Observable<BlogPost[]> {
    return this.http.get<BlogPost[]>(this.apiUrl);
  }

  getPostById(postId: number): Observable<BlogPost> {
    return this.http.get<BlogPost>(`${this.apiUrl}/${postId}`);
  }

  createPost(post: { title: string, author: string, content: string, tags?: string[] }): Observable<any> {
    return this.http.post(this.apiUrl, post);
  }

  deletePost(postId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${postId}`);
  }
}
