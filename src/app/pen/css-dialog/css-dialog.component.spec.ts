import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CssDialogComponent } from './css-dialog.component';

describe('CssDialogComponent', () => {
  let component: CssDialogComponent;
  let fixture: ComponentFixture<CssDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CssDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CssDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
