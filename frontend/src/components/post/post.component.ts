import { Component, OnInit } from '@angular/core';
import { BlogService, BlogPost } from '../../services/blog.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post',
  imports: [CommonModule],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  postTitle: string = '';
  post?: BlogPost;
  id: number = 0;

  constructor(private blogService: BlogService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.id = Number(idParam);
        this.loadPost(this.id);
      }
    });
  }

  loadPost(id: number) {
    this.blogService.getPostById(id).subscribe({
      next: (post) => {
        this.post = post;
        this.postTitle = post.title;
      },
      error: (err) => {
        console.error('Failed to load post', err);
      }
    });
  }
}
