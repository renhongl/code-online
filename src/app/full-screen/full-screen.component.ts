import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';

@Component({
  selector: 'app-full-screen',
  templateUrl: './full-screen.component.html',
  styleUrls: ['./full-screen.component.sass']
})
export class FullScreenComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.init();
    interval(1000).subscribe(() => {
      this.init();
    });
  }

  init() {
    const doc = document.querySelector('iframe').contentDocument;
    const content = localStorage.getItem('code-online-view');
    doc.open();
    doc.write(content);
    doc.close();
  }

}
