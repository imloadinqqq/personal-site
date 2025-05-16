import { Component } from '@angular/core';
import { ClockComponent } from "../clock/clock.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [ClockComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
