import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../services/blog.service';
import { BlogPost } from '../../services/blog.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-blog',
  imports: [CommonModule, RouterLink],
  standalone: true,
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'],
})
export class BlogComponent implements OnInit {
  posts: BlogPost[] = [];
  allTags: string[] = [];

  constructor(private blogService: BlogService) {}

  filteredPosts = [...this.posts];
  currentTagFilter: string | null = null;

  filterByTag(tag: string) {
    this.currentTagFilter = tag;
    this.filteredPosts = this.posts.filter((post) => post.Tags.includes(tag));
  }

  clearFilter() {
    this.currentTagFilter = null;
    this.filteredPosts = [...this.posts];
  }

  ngOnInit(): void {
    this.blogService.getPosts().subscribe({
      next: (posts) => {
        this.posts = posts;
        this.filteredPosts = [...posts];

        const tagSet = new Set<string>();
        this.posts.forEach((post) => {
          post.Tags.forEach((tag) => tagSet.add(tag));
        });
        this.allTags = Array.from(tagSet);
      },
      error: (err) => {
        console.error('Error fetching posts:', err);
      },
    });
  }
}
