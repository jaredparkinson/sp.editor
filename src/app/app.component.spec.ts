import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AppComponent } from './AppComponent';
import { ElectronService } from './providers/electron.service';
import { ChapterService } from './services/chapter.service';
import { HelperService } from './services/helper.service';
import { NavigationService } from './services/navigation.service';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [
        ElectronService,
        ChapterService,
        NavigationService,
        HelperService,
      ],
      imports: [
        HttpClientModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
      ],

      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});

class TranslateServiceStub {
  setDefaultLang(lang: string): void {}
}
