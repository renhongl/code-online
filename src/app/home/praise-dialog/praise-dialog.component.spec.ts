import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PraiseDialogComponent } from './praise-dialog.component';

describe('PraiseDialogComponent', () => {
  let component: PraiseDialogComponent;
  let fixture: ComponentFixture<CssDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PraiseDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PraiseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
