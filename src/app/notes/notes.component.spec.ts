import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  NO_ERRORS_SCHEMA
} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChapterService } from '../services/chapter.service';
import { HelperService } from '../services/helper.service';
import { NavigationService } from '../services/navigation.service';
import { NotesComponent } from './notes.component';

describe('NotesComponent', () => {
  let component: NotesComponent;
  let fixture: ComponentFixture<NotesComponent>;
  const routes: Routes = [];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NotesComponent],
      providers: [ChapterService, NavigationService, HelperService],
      imports: [HttpClientModule, RouterModule.forChild(routes)],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
