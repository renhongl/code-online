import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PenComponent } from '../pen.component';
import { PenService } from '../pen.service';

@Component({
  selector: 'app-js-dialog',
  templateUrl: './js-dialog.component.html',
  styleUrls: ['./js-dialog.component.scss']
})
export class JsDialogComponent implements OnInit {

  list: Array<string>;
  searchResult: any;
  searchWord: string;
  timer: any;
  mode: string;

  constructor(
    public dialogRef: MatDialogRef<PenComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private penSer: PenService) {
    }

  ngOnInit() {
    this.list = this.data.jsLibrary;
    this.mode = this.data.mode;
  }

  onClose(): void {
    this.dialogRef.close({ jsLibrary: this.list, mode: this.mode });
  }

  search() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      this.penSer.searchPath(this.searchWord).subscribe(data => {
        this.searchResult = data['results'];
      });
    }, 1000);
  }

  add(value) {
    this.list.push(value);
    this.searchResult = [];
  }

  remove(i) {
    this.list.splice(i, 1);
  }

}
