import { Component, ChangeDetectionStrategy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import CodeMirror from 'codemirror';
// import { interval } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { JsDialogComponent } from './js-dialog/js-dialog.component';
import { CssDialogComponent } from './css-dialog/css-dialog.component';


import 'codemirror/addon/lint/lint.css';

import 'codemirror/addon/edit/closebrackets.js';
import 'codemirror/addon/edit/closetag.js';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/mode/htmlmixed/htmlmixed.js';
import 'codemirror/mode/css/css.js';

import 'codemirror/addon/selection/active-line.js';
import 'codemirror/addon/fold/foldcode.js';
import 'codemirror/addon/fold/foldgutter.js';
import 'codemirror/addon/fold/brace-fold.js';
import 'codemirror/addon/comment/comment.js';
import 'codemirror/addon/comment/continuecomment.js';

import 'codemirror/addon/lint/lint.js';
import 'codemirror/addon/lint/javascript-lint.js';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-pen',
  templateUrl: './pen.component.html',
  styleUrls: ['./pen.component.scss']
})
export class PenComponent implements OnInit {

  jsCode: string;
  htmlCode: string;
  cssCode: string;
  doc: any;
  jsEditor: any;
  htmlEditor: any;
  cssEditor: any;
  jsChangeTimer: any;
  htmlChangeTimer: any;
  cssChangeTimer: any;
  jsLibrary: Array<string>;
  changeTitle: boolean;
  titleWord: string;
  cssLibrary: Array<string>;

  // showPreview = true;
  showIframeHider = false;
  mode = 'None';
  currentView = 'top';
  cssMode = 'None';

  @ViewChild('js', { static: false }) jsRef;
  @ViewChild('html', { static: false }) htmlRef;
  @ViewChild('css', { static: false }) cssRef;

  @ViewChild('jsTitle', { static: true }) jsTitleRef;
  @ViewChild('title', { static: true }) titleRef;

  constructor(public dialog: MatDialog, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.titleWord = localStorage.getItem('code-online-title') || 'Untitled';
    this.jsCode = localStorage.getItem('code-online-js') || '';
    this.htmlCode = localStorage.getItem('code-online-html') || '';
    this.cssCode = localStorage.getItem('code-online-css') || '';
    this.mode = localStorage.getItem('code-online-mode') || 'None';
    this.cssMode = localStorage.getItem('code-online-cssmode') || 'None';
    this.jsLibrary = JSON.parse(localStorage.getItem('code-online-jsLib')) || [];
    this.cssLibrary = JSON.parse(localStorage.getItem('code-online-cssLib')) || [];
    setTimeout(() => {
      this.updateDocumentTitle();
      this.initJs();
      this.initHtml();
      this.initCss();
      this.refresh();
      this.autoUpdate();
    }, 500);
    // this.handleSave();
  }

  goToGit() {
    window.open('https://github.com/renhongl', '_blank');
  }

  openNewTab() {
    window.open('/code-online#/fullScreen', '_blank');
  }
  
  changeView(value) {
    this.currentView = value;
    setTimeout(() => {
      this.initJs();
      this.initHtml();
      this.initCss();
      this.refresh();
      this.autoUpdate();
    }, 500);
  }

  updateTitle() {
    localStorage.setItem('code-online-title', this.titleWord);
    this.updateDocumentTitle();
  }

  updateDocumentTitle() {
    document.title = this.titleWord;
  }

  disableTitle() {
    this.changeTitle = false;
  }

  toggleTitle() {
    this.changeTitle = !this.changeTitle;
    if (this.changeTitle) {
      this.titleRef.nativeElement.focus();
    }
  }

  getDoc() {
    return document.querySelector('iframe').contentDocument;
  }

  autoUpdate() {
    this.cssEditor.on('change', () => {
      if (this.cssChangeTimer) {
        clearTimeout(this.cssChangeTimer);
      }
      this.cssChangeTimer = setTimeout(() => {
        this.refresh();
      }, 2000);
    });

    this.htmlEditor.on('change', () => {
      if (this.htmlChangeTimer) {
        clearTimeout(this.htmlChangeTimer);
      }
      this.htmlChangeTimer = setTimeout(() => {
        this.refresh();
      }, 2000);
    });

    this.jsEditor.on('change', () => {
      if (this.jsChangeTimer) {
        clearTimeout(this.jsChangeTimer);
      }
      this.jsChangeTimer = setTimeout(() => {
        this.refresh();
      }, 2000);
    });
  }

  refresh() {
    this.jsCode = this.jsEditor.getValue();
    this.htmlCode = this.htmlEditor.getValue();
    this.cssCode = this.cssEditor.getValue();
    this.initPreview();
  }

  handleSave() {
    document.body.addEventListener('keypress', (event) => {
      if (!(event.which === 115 && event.ctrlKey) && !(event.which === 19)) {
        return true;
      };
      this.jsCode = this.jsEditor.getValue();
      this.htmlCode = this.htmlEditor.getValue();
      this.cssCode = this.cssEditor.getValue();
      this.initPreview();
      event.preventDefault();
      event.stopPropagation();
      return false;
    });
  }

  initCss() {
    this.cssEditor = CodeMirror(this.cssRef.nativeElement, {
      value: this.cssCode,
      mode: 'css',
      theme: 'material-darker',
      lineNumbers: true,
      autoCloseBrackets: true,
      styleActiveLine: false,
    });
  }

  initHtml() {
    this.htmlEditor = CodeMirror(this.htmlRef.nativeElement, {
      value: this.htmlCode,
      mode: 'htmlmixed',
      theme: 'material-darker',
      lineNumbers: true,
      autoCloseBrackets: true,
      styleActiveLine: false,
      autoCloseTags: true,
    });
  }

  initJs() {
    this.jsEditor = CodeMirror(this.jsRef.nativeElement, {
      value: this.jsCode,
      mode: 'javascript',
      theme: 'material-darker',
      lineNumbers: true,
      autoCloseBrackets: true,
      styleActiveLine: false,
    });
    this.jsEditor.foldCode(CodeMirror.Pos(0, 0));
  }

  removeTag(tagName) {
    const hs = this.doc.getElementsByTagName(tagName);
    for (let i = 0, max = hs.length; i < max; i++) {
      hs[i].parentNode.removeChild(hs[i]);
    }
  }

  getType() {
    const typeMapping = {
      None: 'text/javascript',
      Babel: 'text/babel',
      TypeScript: 'text/javascript',
      CoffeeScript: 'text/javascript',
    };
    return typeMapping[this.mode];
  }

  writeScript() {
    return this.jsLibrary.map(item => {
      return `<script src="${item}"></script>`;
    });
  }

  getNewIframe() {
    const pre = document.getElementById('previewIframe-' + this.currentView);
    if (!this.jsCode || this.jsCode.indexOf('setInterval') === -1 &&
       this.jsCode.indexOf('setTimeout') === -1 && this.jsCode.indexOf('requestAnimationFrame') === -1) {
      return pre;
    }
    if (pre) {
      document.querySelector('.preview-parent-' + this.currentView).removeChild(pre);
    }
    const curr = document.createElement('iframe');
    curr.setAttribute('id', 'previewIframe-' + this.currentView);
    curr.setAttribute('width', '100%');
    curr.setAttribute('height', '100%');
    curr.setAttribute('frameborder', '0');
    document.querySelector('.preview-parent-' + this.currentView).prepend(curr);
  }

  writeLinks() {
    return this.cssLibrary.map(item => {
      return `<link href="${item}" rel="stylesheet"></link>`;
    });
  }

  initPreview() {
    // this.showPreview = false;
    // this.showPreview = true;
    this.doc = this.getNewIframe();
    setTimeout(() => {
      this.doc = this.getDoc();
      this.doc.location.reload();
      this.doc.open();
      this.doc.write('');
      this.doc.close();
      const content = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <title>Untitled</title>
            ${this.writeLinks().join(',').replace(/,/ig, '')}
            <style>${this.cssCode}</style>
          </head>
          <body>
            ${this.htmlCode}
            ${this.writeScript().join(',').replace(/,/ig, '')}
            <script type="${this.getType()}">
              ${this.jsCode}
            </script>
          </body>
        </html>
      `;
      this.doc.open();
      this.doc.write(content);
      this.doc.close();
      localStorage.setItem('code-online-view', content);
      localStorage.setItem('code-online-js', this.jsCode);
      localStorage.setItem('code-online-html', this.htmlCode);
      localStorage.setItem('code-online-css', this.cssCode);
    }, 1000);
  }

  openJSDialog() {
    const dialogRef = this.dialog.open(JsDialogComponent, {
      width: '40%',
      height: '70%',
      data: { jsLibrary: this.jsLibrary, mode: this.mode },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.jsLibrary = result.jsLibrary || [];
      this.mode = result.mode;
      this.refresh();
      this.cd.detectChanges();
      localStorage.setItem('code-online-jsLib', JSON.stringify(this.jsLibrary));
      localStorage.setItem('code-online-mode', this.mode);
    });
  }

  openCssDialog() {
    const dialogRef = this.dialog.open(CssDialogComponent, {
      width: '40%',
      height: '70%',
      data: { cssLibrary: this.cssLibrary, cssMode: this.cssMode },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.cssLibrary = result.cssLibrary || [];
      this.cssMode = result.mode;
      this.refresh();
      this.cd.detectChanges();
      localStorage.setItem('code-online-cssLib', JSON.stringify(this.cssLibrary));
      localStorage.setItem('code-online-cssmode', this.cssMode);
    });
  }

}
