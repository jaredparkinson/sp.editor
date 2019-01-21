import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyBlockParentComponent } from './body-block-parent.component';

describe('BodyBlockParentComponent', () => {
  let component: BodyBlockParentComponent;
  let fixture: ComponentFixture<BodyBlockParentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BodyBlockParentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BodyBlockParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
