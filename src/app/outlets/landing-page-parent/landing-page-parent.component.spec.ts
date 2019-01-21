import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPageParentComponent } from './landing-page-parent.component';

describe('LandingPageParentComponent', () => {
  let component: LandingPageParentComponent;
  let fixture: ComponentFixture<LandingPageParentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingPageParentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingPageParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
