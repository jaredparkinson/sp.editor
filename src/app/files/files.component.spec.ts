import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { HelperService } from '../services/helper.service';
import { NavigationService } from '../services/navigation.service';
import { FilesComponent } from './files.component';

describe('FilesComponent', () => {
  let component: FilesComponent;
  let fixture: ComponentFixture<FilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilesComponent],
      providers: [NavigationService, HelperService],
      imports: [HttpClientModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
