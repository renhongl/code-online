import { Component, ChangeDetectionStrategy, OnInit, ViewChild, ElementRef } from '@angular/core';
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

  showPreview = true;
  showIframeHider = false;

  @ViewChild('js', { static: true }) jsRef;
  @ViewChild('html', { static: true }) htmlRef;
  @ViewChild('css', { static: true }) cssRef;

  constructor(public dialog: MatDialog) {
    this.jsLibrary = ['http://localhost:4200/code-online/', 'http://localhost:4200/code-online/'];
  }

  ngOnInit() {
    this.jsCode = '';
    this.htmlCode = '';
    this.cssCode = '';
    this.initJs();
    this.initHtml();
    this.initCss();
    // this.handleSave();
    this.autoUpdate();
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

  initPreview() {
    this.showPreview = false;
    this.showPreview = true;
    setTimeout(() => {
      this.doc = this.getDoc();
      this.doc.body.innerHTML = this.htmlCode;
      this.jsLibrary.forEach(item => {
        const s = document.createElement('script');
        s.setAttribute('src', item);
        this.doc.body.appendChild(s);
      });
      const script = document.createElement('script');
      const jsCode = `(function() { "use strict"; ${this.jsCode}}())`;
      script.innerHTML = jsCode;
      const style = document.createElement('style');
      style.innerHTML = this.cssCode;
      this.doc.head.appendChild(style);
      this.doc.body.appendChild(script);
    }, 1000);
  }

  openJSDialog() {
    const dialogRef = this.dialog.open(JsDialogComponent, {
      width: '40%',
      height: '70%',
      data: {jsLibrary: this.jsLibrary}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.jsLibrary = result.jsLibrary;
      this.refresh();
    });
  }

}
