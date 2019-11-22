import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-js-dialog',
  templateUrl: './js-dialog.component.html',
  styleUrls: ['./js-dialog.component.scss']
})
export class JsDialogComponent implements OnInit {

  list: any;

  constructor(public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      this.list = [];
    }

  ngOnInit() {
  }

  onClose(): void {
    this.dialogRef.close({ list: this.list });
  }

  addMore() {
    this.list.push('');
  }

}
