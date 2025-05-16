import { Routes } from '@angular/router';
import { BlogComponent } from '../components/blog/blog.component';
import { AboutComponent } from '../components/about/about.component';
import { PhotosComponent } from '../components/photos/photos.component';
import { EquipmentComponent } from '../components/equipment/equipment.component';
import { ProjectsComponent } from '../components/projects/projects.component';
import { ResumeComponent } from '../components/resume/resume.component';
import { BooksComponent } from '../components/books/books.component';
import { HomeComponent } from '../components/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'ALEX DIAZ' },
  { path: 'blog', component: BlogComponent, title: 'blog' },
  { path: 'about', component: AboutComponent, title: 'about' },
  { path: 'photos', component: PhotosComponent, title: 'photos' },
  { path: 'equipment', component: EquipmentComponent, title: 'equipment' },
  { path: 'projects', component: ProjectsComponent, title: 'projects' },
  { path: 'resume', component: ResumeComponent, title: 'resume' },
  { path: 'books', component: BooksComponent, title: 'books' }
];
