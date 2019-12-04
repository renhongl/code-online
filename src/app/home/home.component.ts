import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  list: any;

  constructor(private router: Router, private homeSer: HomeService) { }

  ngOnInit() {
    document.title = 'Code Online';
    this.homeSer.getPens().subscribe(data => {
      this.list = data;
      setTimeout(() => {
        for(let i = 0; i < this.list.length; i++) {
          this.writeDocument(i);
        }
      }, 2000);
    });
  }

  searchPens(e) {
    this.homeSer.getPens().subscribe(data => {
      this.list = data['filter'](item => {
        if (item['code-online-title'].toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1) {
          return true;
        }
        return false;
      });
      setTimeout(() => {
        for(let i = 0; i < this.list.length; i++) {
          this.writeDocument(i);
        }
      }, 2000);
    });
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

  getContent(i) {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Untitled</title>
        <style>*{margin: 0;padding: 0}body{overflow:hidden}</style>
        ${this.writeLinks(this.list[i]['code-online-cssLib']).join(',').replace(/,/ig, '')}
        <style>${this.list[i]['code-online-css']}</style>
      </head>
      <body>
        ${this.list[i]['code-online-html']}
        ${this.writeScript(this.list[i]['code-online-jsLib']).join(',').replace(/,/ig, '')}
        <script type="${this.getType(this.list[i]['code-online-mode'])}">
          ${this.list[i]['code-online-js']}
        </script>
      </body>
    </html>
  `;
  }

  goToGit() {
    window.open('https://github.com/renhongl/code-online', '_blank');
  }

  writeDocument(i) {
    const dom = document.getElementById('preview-iframe' + i);
    if (dom) {
      const doc = dom['contentDocument'];
      doc.open();
      doc.write('');
      doc.close();
      const content = this.getContent(i);
      doc.open();
      doc.write(content);
      doc.close();
    }
  }

  newPen() {
    localStorage.setItem('code-online-view', '');
    localStorage.setItem('code-online-js', '');
    localStorage.setItem('code-online-html', '');
    localStorage.setItem('code-online-css', '');
    localStorage.setItem('code-online-cssLib', '[]');
    localStorage.setItem('code-online-jsLib', '[]');
    localStorage.setItem('code-online-mode', '');
    localStorage.setItem('code-online-view-type', 'top');
    localStorage.setItem('code-online-title', 'Untitled');
    this.router.navigate(['/pen']);
  }

  openPen(i) {
    const content = this.getContent(i);
    localStorage.setItem('code-online-view', content);
    localStorage.setItem('code-online-js', this.list[i]['code-online-js']);
    localStorage.setItem('code-online-html', this.list[i]['code-online-html']);
    localStorage.setItem('code-online-css', this.list[i]['code-online-css']);

    localStorage.setItem('code-online-cssLib', JSON.stringify(this.list[i]['code-online-cssLib']));
    localStorage.setItem('code-online-jsLib', JSON.stringify(this.list[i]['code-online-jsLib']));
    localStorage.setItem('code-online-mode', this.list[i]['code-online-mode']);
    localStorage.setItem('code-online-view-type', this.list[i]['code-online-view-type']);
    localStorage.setItem('code-online-title', this.list[i]['code-online-title']);
  }

}
