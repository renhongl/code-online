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
      const content = this.getContent();
      document.title = localStorage.getItem('code-online-title');
      doc.open();
      doc.write(content);
      doc.close();
    }, 1000);
  }

  writeLinks(arr) {
    return arr.map(item => {
      return `<link href="${item}" rel="stylesheet"></link>`;
    });
  }

  writeScript(arr) {
    return arr.map(item => {
      return `<script src="${item}"></script>`;
    });
  }

  getType(mode) {
    const typeMapping = {
      None: 'text/javascript',
      Babel: 'text/babel',
      TypeScript: 'text/typescript',
    };
    return typeMapping[mode];
  }

  getContent() {
    const mode = localStorage.getItem('code-online-mode');
    const jsLibs = JSON.parse(localStorage.getItem('code-online-jsLib'));
    if (mode === 'Babel') {
      jsLibs.unshift('https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.26.0/babel.min.js');
    }
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Untitled</title>
        <style>*{margin: 0;padding: 0}body{overflow:hidden}</style>
        ${this.writeLinks(JSON.parse(localStorage.getItem('code-online-cssLib'))).join(',').replace(/,/ig, '')}
        <style>${localStorage.getItem('code-online-css')}</style>
      </head>
      <body>
        ${localStorage.getItem('code-online-html')}
        ${this.writeScript(jsLibs).join(',').replace(/,/ig, '')}
        <script type="${this.getType(mode)}">
          ${localStorage.getItem('code-online-js')}
        </script>
      </body>
    </html>
  `;
  }

}
