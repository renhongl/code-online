import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';



@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-pen',
  templateUrl: './pen.component.html',
  styleUrls: ['./pen.component.css']
})
export class PenComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
