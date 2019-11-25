import { Component, ChangeDetectionStrategy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import CodeMirror from 'codemirror';
// import { interval } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { JsDialogComponent } from './js-dialog/js-dialog.component';


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

  showPreview = true;
  showIframeHider = false;
  mode = 'None';
  titleWord = 'Untitled';
  currentView = 'top';

  @ViewChild('js', { static: false }) jsRef;
  @ViewChild('html', { static: false }) htmlRef;
  @ViewChild('css', { static: false }) cssRef;

  @ViewChild('jsTitle', { static: true }) jsTitleRef;
  @ViewChild('title', { static: true }) titleRef;

  constructor(public dialog: MatDialog, private cd: ChangeDetectorRef) {
    this.jsLibrary = [];
  }

  ngOnInit() {
    this.jsCode = localStorage.getItem('code-online-js') || '';
    this.htmlCode = localStorage.getItem('code-online-html') || '';
    this.cssCode = localStorage.getItem('code-online-css') || '';
    setTimeout(() => {
      this.initJs();
      this.initHtml();
      this.initCss();
      this.refresh();
      this.autoUpdate();
    }, 500);
    // this.handleSave();
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

  initPreview() {
    this.showPreview = false;
    this.showPreview = true;
    setTimeout(() => {
      this.doc = this.getDoc();
      const content = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <title>Untitled</title>
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
    });
  }

}
