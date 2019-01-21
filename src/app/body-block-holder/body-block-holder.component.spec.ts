import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyBlockHolderComponent } from './body-block-holder.component';

describe('BodyBlockHolderComponent', () => {
  let component: BodyBlockHolderComponent;
  let fixture: ComponentFixture<BodyBlockHolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BodyBlockHolderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BodyBlockHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
