import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-full-screen',
  templateUrl: './full-screen.component.html',
  styleUrls: ['./full-screen.component.sass']
})
export class FullScreenComponent implements OnInit {

  showContent: boolean;

  constructor() { }

  ngOnInit() {
    this.init();
    window.addEventListener('storage', () => {
      location.reload();
    }, false);
  }

  init() {
    this.showContent = false;
    this.showContent = true;
    setTimeout(() => {
      const doc = document.querySelector('iframe').contentDocument;
      const content = localStorage.getItem('code-online-view');
      document.title = localStorage.getItem('code-online-title');
      doc.open();
      doc.write(content);
      doc.close();
    }, 1000);
  }

}
