import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsParentComponent } from './settings-parent.component';

describe('SettingsParentComponent', () => {
  let component: SettingsParentComponent;
  let fixture: ComponentFixture<SettingsParentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsParentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
