import {
  APP_INITIALIZER,
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  NO_ERRORS_SCHEMA,
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
import { ServiceWorkerModule } from '@angular/service-worker';
import { AppConfig } from '../environments/environment';
import { AppComponent } from './app.component';
import { BodyBlockHolderComponent } from './body-block-holder/body-block-holder.component';
import { BodyblockComponent } from './bodyblock/bodyblock.component';
// import { ButtonHighlightDirective } from './button-highlight.directive';
import { HomeComponent } from './components/home/home.component';
import { EditorComponent } from './editor/editor.component';
// import { SyncScrollingDirective } from './directive/sync-scrolling.directive';
import { FilesComponent } from './files/files.component';
import { UrlBuilder } from './files/UrlBuilder';
import { HeaderComponent } from './header/header.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { NoteEditorComponent } from './note-editor/note-editor.component';
import { NoteSettingsComponent } from './note-settings/note-settings.component';
import { NotesComponent } from './notes/notes.component';
import { BodyBlockParentComponent } from './outlets/body-block-parent/body-block-parent.component';
import { EditorParentComponent } from './outlets/editor-parent/editor-parent.component';
import { LandingPageParentComponent } from './outlets/landing-page-parent/landing-page-parent.component';
import { SearchComponent } from './search/search.component';
import { ChapterService } from './services/chapter.service';
import { DownloadService } from './services/download.service';
import { HelperService } from './services/helper.service';
import { NavigationService } from './services/navigation.service';
import { SaveStateService } from './services/save-state.service';
import { VerseSelectService } from './services/verse-select.service';
import { SettingsComponent } from './settings/settings.component';
import { VerseComponent } from './components/verse/verse.component';
import { SyncScrollingService } from './services/sync-scrolling.service';

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
    NoteEditorComponent,
    NotesComponent,
    HeaderComponent,
    LandingPageComponent,
    SearchComponent,
    // ButtonHighlightDirective,
    // SyncScrollingDirective,
    SettingsComponent,
    NoteSettingsComponent,
    EditorComponent,
    BodyBlockHolderComponent,
    EditorParentComponent,
    BodyBlockParentComponent,
    LandingPageParentComponent,
    VerseComponent,
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
        deps: [HttpClient],
      },
    }),
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: AppConfig.production,
    }),
  ],
  providers: [
    ElectronService,
    NavigationService,
    ChapterService,
    HelperService,
    UrlBuilder,
    DownloadService,
    SyncScrollingService,
    SaveStateService,
    VerseSelectService,
    {
      provide: APP_INITIALIZER,
      useFactory: load,
      deps: [SaveStateService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class AppModule {
  constructor() {}
}
