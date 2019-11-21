import { Component, ChangeDetectionStrategy, OnInit, ViewChild, ElementRef } from '@angular/core';
import CodeMirror from 'codemirror';
import { interval } from 'rxjs';

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

  showIframeHider = false;

  @ViewChild('js', {static: true}) jsRef;
  @ViewChild('preview', {static: true}) previewRef;
  @ViewChild('html', {static: true}) htmlRef;
  @ViewChild('css', {static: true}) cssRef;

  constructor() { }

  ngOnInit() {
    const preview = this.previewRef.nativeElement;
    this.doc = preview.contentDocument;
    this.jsCode = 'console.log("Hello World")';
    this.htmlCode = '<div>test</div>';
    this.cssCode = 'h1{color: red}';
    this.initJs();
    this.initHtml();
    this.initCss();
    this.initPreview();
    // this.handleSave();
    this.autoUpdate();
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
      mode:  'css'
    });
  }

  initHtml() {
    this.htmlEditor = CodeMirror(this.htmlRef.nativeElement, {
      value: this.htmlCode,
      mode:  'html'
    });
  }

  removeTag(tagName) {
    const hs = this.doc.getElementsByTagName(tagName);
    for (let i = 0, max = hs.length; i < max; i++) {
        hs[i].parentNode.removeChild(hs[i]);
    }
  }

  initPreview() {
    this.removeTag('style');
    this.removeTag('script');
    const script = document.createElement('script');
    script.innerHTML = this.jsCode;
    const style = document.createElement('style');
    style.innerHTML = this.cssCode;
    this.doc.head.appendChild(style);
    this.doc.body.innerHTML = this.htmlCode;
    this.doc.body.appendChild(script);
  }

  initJs() {
    this.jsEditor = CodeMirror(this.jsRef.nativeElement, {
      value: this.jsCode,
      mode:  'javascript'
    });
  }

}
