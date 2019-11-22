import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JsDialogComponent } from './js-dialog.component';

describe('JsDialogComponent', () => {
  let component: JsDialogComponent;
  let fixture: ComponentFixture<JsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
