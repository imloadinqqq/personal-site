import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-clock',
  imports: [CommonModule],
  templateUrl: './clock.component.html',
  styleUrl: './clock.component.css'
})
export class ClockComponent implements OnInit{
time = new Date();
  index: any;

  ngOnInit() {
    this.index = setInterval(() => {
      this.time = new Date();
    }, 1000);
  }
}
