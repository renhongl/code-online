import { Component, ChangeDetectionStrategy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import CodeMirror from 'codemirror';
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

import 'codemirror/addon/dialog/dialog.js';
import 'codemirror/addon/dialog/dialog.css';

import 'codemirror/addon/search/search.js';
import 'codemirror/addon/search/searchcursor.js';
import 'codemirror/addon/search/match-highlighter.js';
import 'codemirror/addon/search/jump-to-line.js';


import jshint from 'jshint';
import cssLint from 'csslint';
import 'codemirror/addon/lint/lint.js';
import 'codemirror/addon/lint/javascript-lint.js';
import 'codemirror/addon/lint/html-lint.js';
import 'codemirror/addon/lint/css-lint.js';
import 'codemirror-formatting';

declare const emmetCodeMirror;
(<any>window).JSHINT = jshint.JSHINT;
(<any>window).CSSLint = cssLint.CSSLint;

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
  downloadUrl: string;

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
    this.jsLibrary = this.getLibs('code-online-jsLib');
    this.cssLibrary = this.getLibs('code-online-cssLib');
    this.currentView = localStorage.getItem('code-online-view-type') || 'top';
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

  getLibs(topic) {
    let arr = JSON.parse(localStorage.getItem(topic)) || [];
    arr = this.getNoneEmpty(arr);
    return arr;
  }

  getNoneEmpty(arr) {
    return arr.filter(item => item.toLowerCase() !== '');
  }

  goToGit() {
    window.open('https://github.com/renhongl/code-online', '_blank');
  }

  openNewTab() {
    window.open('/code-online#/fullScreen', '_blank');
  }

  changeView(value) {
    this.currentView = value;
    localStorage.setItem('code-online-view-type', value);
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

  formatJs() {
    const range = { from: this.jsEditor.getCursor(true), to: this.jsEditor.getCursor(false) };
    this.jsEditor.autoFormatRange(range.from, range.to);
  }

  formatHtml() {
    const range = { from: this.htmlEditor.getCursor(true), to: this.htmlEditor.getCursor(false) };
    this.htmlEditor.autoFormatRange(range.from, range.to);
  }

  formatCss() {
    const range = { from: this.cssEditor.getCursor(true), to: this.cssEditor.getCursor(false) };
    this.cssEditor.autoFormatRange(range.from, range.to);
  }

  commentJs() {
    const range = { from: this.jsEditor.getCursor(true), to: this.jsEditor.getCursor(false) };
    this.jsEditor.commentRange(true, range.from, range.to);
  }

  unCommentJs() {
    const range = { from: this.jsEditor.getCursor(true), to: this.jsEditor.getCursor(false) };
    this.jsEditor.commentRange(false, range.from, range.to);
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
      theme: 'monokai',
      lineNumbers: true,
      autoCloseBrackets: true,
      styleActiveLine: false,
      indentWithTabs: true,
      indentUnit: 2,
      tabSize: 2,
      lint: true,
    });
  }

  initHtml() {
    this.htmlEditor = CodeMirror(this.htmlRef.nativeElement, {
      value: this.htmlCode,
      mode: 'htmlmixed',
      theme: 'monokai',
      lineNumbers: true,
      autoCloseBrackets: true,
      styleActiveLine: false,
      autoCloseTags: true,
      profile: 'html',
      indentWithTabs: true,
      indentUnit: 2,
      tabSize: 2,
      lint: true,
    });
    emmetCodeMirror(this.htmlEditor, {
      Tab: 'emmet.expand_abbreviation_with_tab',
    });
  }

  initJs() {
    this.jsEditor = CodeMirror(this.jsRef.nativeElement, {
      value: this.jsCode,
      mode: 'javascript',
      theme: 'monokai',
      lineNumbers: true,
      autoCloseBrackets: true,
      styleActiveLine: false,
      indentWithTabs: true,
      indentUnit: 2,
      tabSize: 2,
      gutters: ['CodeMirror-lint-markers'],
      lint: { esversion: '8' }
    });
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
      TypeScript: 'text/typescript',
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
    if (!this.jsCode) {
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
            <script src="/code-online/assets/libs/console.js"></script>
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

      document.getElementById('output').innerHTML = '';
    }, 1000);
  }

  openJSDialog() {
    const dialogRef = this.dialog.open(JsDialogComponent, {
      width: '600px',
      height: '70%',
      data: { jsLibrary: this.jsLibrary, mode: this.mode },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      let arr = result.jsLibrary || [];
      arr = this.getNoneEmpty(arr);
      this.jsLibrary = arr;
      this.mode = result.mode;
      const babelPath = 'https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.26.0/babel.min.js';
      const path = 'https://cdnjs.cloudflare.com/ajax/libs/typescript/3.6.3/typescript.min.js';
      if (this.mode === 'Babel') {
        this.jsLibrary = this.jsLibrary.filter(item => item !== babelPath);
        this.jsLibrary = this.jsLibrary.filter(item => item !== path);
        this.jsLibrary.push(babelPath);
      } else if (this.mode === 'TypeScript') {
        this.jsLibrary = this.jsLibrary.filter(item => item !== babelPath);
        this.jsLibrary = this.jsLibrary.filter(item => item !== path);
        this.jsLibrary.push(path);
        this.jsLibrary.push('/code-online/assets/libs/typescript.compile.js');
      }
      this.refresh();
      this.cd.detectChanges();
      localStorage.setItem('code-online-jsLib', JSON.stringify(this.jsLibrary));
      localStorage.setItem('code-online-mode', this.mode);
    });
  }

  openCssDialog() {
    const dialogRef = this.dialog.open(CssDialogComponent, {
      width: '600px',
      height: '70%',
      data: { cssLibrary: this.cssLibrary, cssMode: this.cssMode },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      let arr = result.cssLibrary || [];
      arr = this.getNoneEmpty(arr);
      this.cssLibrary = arr;
      this.cssMode = result.mode;
      this.refresh();
      this.cd.detectChanges();
      localStorage.setItem('code-online-cssLib', JSON.stringify(this.cssLibrary));
      localStorage.setItem('code-online-cssmode', this.cssMode);
    });
  }

  downloadSource() {
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(localStorage.getItem('code-online-view'))
    );
    element.setAttribute('download', this.titleWord + '.html');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

}
