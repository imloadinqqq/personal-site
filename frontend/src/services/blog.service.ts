import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(private http: HttpClient) { }

  getPosts() {
    
  }
  
  getPostByID(postId: number) {

  }

  createPost() {

  }

  deletePost(postId: number) {

  }
}
