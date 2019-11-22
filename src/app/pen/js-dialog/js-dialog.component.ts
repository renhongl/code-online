import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PenComponent } from '../pen.component';


@Component({
  selector: 'app-js-dialog',
  templateUrl: './js-dialog.component.html',
  styleUrls: ['./js-dialog.component.scss']
})
export class JsDialogComponent implements OnInit {

  list: Array<string>;
  searchResult: Array<string>;

  constructor(
    public dialogRef: MatDialogRef<PenComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {
    }

  ngOnInit() {
    this.list = this.data.jsLibrary;
  }

  onClose(): void {
    this.dialogRef.close({ jsLibrary: this.list });
  }

  search() {
    this.searchResult = ['https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.15/lodash.min.js'];
  }

  add(value) {
    this.list.push(value);
    this.searchResult = [];
  }

  remove(i) {
    this.list.splice(i, 1);
  }

}
