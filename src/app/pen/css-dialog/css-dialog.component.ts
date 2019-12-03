import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PenComponent } from '../pen.component';
import { PenService } from '../pen.service';

@Component({
  selector: 'app-css-dialog',
  templateUrl: './css-dialog.component.html',
  styleUrls: ['./css-dialog.component.scss']
})
export class CssDialogComponent implements OnInit {

  list: Array<string>;
  searchResult: any;
  searchWord: string;
  timer: any;
  cssMode: string;

  constructor(
    public dialogRef: MatDialogRef<PenComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private penSer: PenService) {
    }

  ngOnInit() {
    this.list = this.data.cssLibrary;
    this.cssMode = this.data.cssMode;
  }

  onClose(): void {
    this.dialogRef.close({ cssLibrary: this.list, mode: this.cssMode });
  }

  getCssFile(list) {
    return list.filter(item => {
      const n = item.latest;
      const arr = n.split('.');
      const types = ['css', 'CSS', 'Css', 'scss', 'less'];
      const type = arr[arr.length - 1];
      if (types.includes(type)) {
        return true;
      }
      return false;
    });
  }

  search() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      this.penSer.searchPath(this.searchWord + '.css').subscribe(data => {
        this.searchResult = this.getCssFile(data['results']);
      });
    }, 1000);
  }

  add(value) {
    this.list.push(value);
    this.searchResult = [];
    this.searchWord = '';
  }

  remove(i) {
    this.list.splice(i, 1);
  }

  addOneItem() {
    this.list.push('');
  }

  updateItem(i, e) {
    this.list[i] = e.target.value;
  }


}
