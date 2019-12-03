import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from '../pen/home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  list: any;

  constructor(private router: Router, private homeSer: HomeService) { }

  ngOnInit() {
    this.homeSer.getPens('').subscribe(data => {
      this.list = data;
    });
  }

  newPen() {
    localStorage.setItem('code-online-view', '');
    localStorage.setItem('code-online-js', '');
    localStorage.setItem('code-online-html', '');
    localStorage.setItem('code-online-css', '');
    this.router.navigate(['/pen']);
  }

}
