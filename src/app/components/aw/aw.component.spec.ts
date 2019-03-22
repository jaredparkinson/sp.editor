import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AWComponent } from './aw.component';

describe('AWComponent', () => {
  let component: AWComponent;
  let fixture: ComponentFixture<AWComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AWComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AWComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
