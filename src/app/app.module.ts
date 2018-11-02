import {
  APP_INITIALIZER,
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  NO_ERRORS_SCHEMA
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import 'reflect-metadata';
import 'zone.js/dist/zone-mix';
import '../polyfills';

import { HttpClient, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ElectronService } from './providers/electron.service';

import { WebviewDirective } from './directives/webview.directive';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { timingSafeEqual } from 'crypto';
import { AppConfig } from '../environments/environment';
import { AppComponent } from './app.component';
import { BodyblockComponent } from './bodyblock/bodyblock.component';
// import { ButtonHighlightDirective } from './button-highlight.directive';
import { HomeComponent } from './components/home/home.component';
// import { SyncScrollingDirective } from './directive/sync-scrolling.directive';
import { FilesComponent } from './files/files.component';
import { UrlBuilder } from './files/UrlBuilder';
import { HeaderComponent } from './header/header.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { NoteSettingsComponent } from './note-settings/note-settings.component';
import { NotesComponent } from './notes/notes.component';
import { SearchComponent } from './search/search.component';
import { ChapterService } from './services/chapter.service';
import { DownloadService } from './services/download.service';
import { HelperService } from './services/helper.service';
import { NavigationService } from './services/navigation.service';
import { SaveStateService } from './services/save-state.service';
import { SettingsComponent } from './settings/settings.component';
// import { TSQuery } from './TSQuery';
// import { SearchBarComponent } from './search-bar/search-bar.component';
// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function load(saveState: SaveStateService) {
  return () => saveState.load();
}
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WebviewDirective,
    FilesComponent,
    BodyblockComponent,
    NotesComponent,
    HeaderComponent,
    LandingPageComponent,
    SearchComponent,
    // ButtonHighlightDirective,
    // SyncScrollingDirective,
    SettingsComponent,
    NoteSettingsComponent
    // SearchBarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: AppConfig.production
    })
  ],
  providers: [
    ElectronService,
    NavigationService,
    ChapterService,
    HelperService,
    UrlBuilder,
    DownloadService,
    SaveStateService,
    {
      provide: APP_INITIALIZER,
      useFactory: load,
      deps: [SaveStateService],
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class AppModule {
  constructor() {}
}
