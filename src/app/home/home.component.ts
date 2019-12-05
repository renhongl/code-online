import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  list: any;
  currPage = 0;
  pageLimit = 6;
  filter = '';
  currentList: any;
  firstPage = true;
  lastPage = false;

  constructor(private router: Router, private homeSer: HomeService) { }

  ngOnInit() {
    document.title = 'Code Online';
    this.initIframes('');
  }

  initIframes(filter) {
    this.homeSer.getPens().subscribe(data => {
      this.list = data['filter'](item => {
        if (item['code-online-title'].toLowerCase().indexOf(filter.toLowerCase()) !== -1) {
          return true;
        }
        return false;
      });
      const from = this.currPage * this.pageLimit;
      const temp = [...this.list];
      if (Math.ceil(this.list.length / this.pageLimit) - 1 <= 0) {
        this.lastPage = true;
      }
      this.currentList = temp.splice(from, this.pageLimit);
      setTimeout(() => {
        this.currentList.forEach(item => this.writeDocument(item));
      }, 2000);
    });
  }

  nextPage() {
    if (this.currPage === Math.floor(this.list.length / this.pageLimit)) {
      return;
    }
    if (this.currPage === Math.floor(this.list.length / this.pageLimit) - 1) {
      this.lastPage = true;
    } else {
      this.lastPage = false;
    }
    this.firstPage = false;
    this.currPage += 1;
    this.initIframes(this.filter);
  }

  prevPage() {
    if (this.currPage === 0) {
      return;
    }
    if (this.currPage === 1) {
      this.firstPage = true;
    } else {
      this.firstPage = false;
    }
    this.lastPage = false;
    this.currPage -= 1;
    this.initIframes(this.filter);
  }

  searchPens(e) {
    this.currPage = 0;
    this.firstPage = true;
    this.lastPage = false;
    this.initIframes(e.target.value);
    this.filter = e.target.value;
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

  getContent(item) {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Untitled</title>
        <style>*{margin: 0;padding: 0}body{overflow:hidden}</style>
        ${this.writeLinks(item['code-online-cssLib']).join(',').replace(/,/ig, '')}
        <style>${item['code-online-css']}</style>
      </head>
      <body>
        ${item['code-online-html']}
        ${this.writeScript(item['code-online-jsLib']).join(',').replace(/,/ig, '')}
        <script type="${this.getType(item['code-online-mode'])}">
          ${item['code-online-js']}
        </script>
      </body>
    </html>
  `;
  }

  goToGit() {
    window.open('https://github.com/renhongl/code-online', '_blank');
  }

  writeDocument(item) {
    try {
      const dom = document.getElementById('preview-iframe' + item.id);
      if (dom) {
        const doc = dom['contentDocument'];
        doc.open();
        doc.write('');
        doc.close();
        const content = this.getContent(item);
        doc.open();
        doc.write(content);
        doc.close();
      }
    } catch (error) {
      console.log('Write document error');
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

  openPen(id) {
    const item = this.list.filter(ite => ite.id === id)[0];
    const content = this.getContent(item);
    localStorage.setItem('code-online-view', content);
    localStorage.setItem('code-online-js', item['code-online-js']);
    localStorage.setItem('code-online-html', item['code-online-html']);
    localStorage.setItem('code-online-css', item['code-online-css']);

    localStorage.setItem('code-online-cssLib', JSON.stringify(item['code-online-cssLib']));
    localStorage.setItem('code-online-jsLib', JSON.stringify(item['code-online-jsLib']));
    localStorage.setItem('code-online-mode', item['code-online-mode']);
    localStorage.setItem('code-online-view-type', item['code-online-view-type']);
    localStorage.setItem('code-online-title', item['code-online-title']);
  }

  openNewTab(id) {
    this.openPen(id);
    window.open('/code-online#/fullScreen', '_blank');
  }

}
