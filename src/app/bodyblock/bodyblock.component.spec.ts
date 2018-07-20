import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyblockComponent } from './bodyblock.component';

describe('BodyblockComponent', () => {
  let component: BodyblockComponent;
  let fixture: ComponentFixture<BodyblockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BodyblockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BodyblockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
