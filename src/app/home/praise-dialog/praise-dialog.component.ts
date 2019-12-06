import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HomeComponent } from '../home.component';

@Component({
  selector: 'app-praise-dialog',
  templateUrl: './praise-dialog.component.html',
  styleUrls: ['./praise-dialog.component.scss']
})
export class PraiseDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<HomeComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {
    }

  ngOnInit() {
    
  }


}
