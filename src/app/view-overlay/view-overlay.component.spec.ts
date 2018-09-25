import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOverlayComponent } from './view-overlay.component';

describe('ViewOverlayComponent', () => {
  let component: ViewOverlayComponent;
  let fixture: ComponentFixture<ViewOverlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewOverlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
