import { Component, ChangeDetectionStrategy, OnInit, ViewChild, ElementRef } from '@angular/core';
import CodeMirror from 'codemirror';
import { interval } from 'rxjs';

import 'codemirror/addon/edit/closebrackets.js';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/mode/htmlmixed/htmlmixed.js';
import 'codemirror/mode/css/css.js';

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

  showPreview = true;
  showIframeHider = true;

  @ViewChild('js', {static: true}) jsRef;
  @ViewChild('preview', {static: true}) previewRef;
  @ViewChild('html', {static: true}) htmlRef;
  @ViewChild('css', {static: true}) cssRef;

  constructor() { }

  ngOnInit() {
    // this.doc = this.getDoc();
    this.jsCode = 'console.log("Hello World")';
    this.htmlCode = '<div>test</div>';
    this.cssCode = 'h1{color: red}';
    this.initJs();
    this.initHtml();
    this.initCss();
    // this.initPreview();
    // this.handleSave();
    this.autoUpdate();
  }

  getDoc() {
    // const preview = this.previewRef.nativeElement;
    return document.querySelector('iframe').contentDocument;
  }

  autoUpdate() {
    interval(1000).subscribe(n => {
      this.jsCode = this.jsEditor.getValue();
      this.htmlCode = this.htmlEditor.getValue();
      this.cssCode = this.cssEditor.getValue();
      this.initPreview();
    });
  }

  handleSave() {
    document.body.addEventListener('keypress', (event) => {
      if (!(event.which === 115 && event.ctrlKey) && !(event.which === 19)){
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
      mode:  'css',
      theme: 'material-darker',
      lineNumbers: true,
      autoCloseBrackets: true,
    });
  }

  initHtml() {
    this.htmlEditor = CodeMirror(this.htmlRef.nativeElement, {
      value: this.htmlCode,
      mode:  'htmlmixed',
      theme: 'material-darker',
      lineNumbers: true,
      autoCloseBrackets: true,
    });
  }

  initJs() {
    this.jsEditor = CodeMirror(this.jsRef.nativeElement, {
      value: this.jsCode,
      mode:  'javascript',
      theme: 'material-darker',
      lineNumbers: true,
      autoCloseBrackets: true,
    });
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
      const script = document.createElement('script');
      script.innerHTML = this.jsCode;
      const style = document.createElement('style');
      style.innerHTML = this.cssCode;
      this.doc.head.appendChild(style);
      this.doc.body.innerHTML = this.htmlCode;
      this.doc.body.appendChild(script);
    }, 1000);
  }

  

}
