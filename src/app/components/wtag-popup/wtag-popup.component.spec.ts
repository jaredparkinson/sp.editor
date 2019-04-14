import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WTagPopupComponent } from './wtag-popup.component';

describe('WTagPopupComponent', () => {
  let component: WTagPopupComponent;
  let fixture: ComponentFixture<WTagPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WTagPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WTagPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
