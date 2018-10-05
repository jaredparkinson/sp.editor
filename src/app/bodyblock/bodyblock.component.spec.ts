import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HelperService } from '../services/helper.service';
import { NavigationService } from '../services/navigation.service';
import { BodyblockComponent } from './bodyblock.component';

describe('BodyblockComponent', () => {
  let component: BodyblockComponent;
  let fixture: ComponentFixture<BodyblockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BodyblockComponent],
      providers: [NavigationService, HelperService],
      imports: [HttpClientModule, RouterModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
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
