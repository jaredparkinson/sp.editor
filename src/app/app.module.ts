import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
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

import { RouterModule, Routes } from '@angular/router';
import { timingSafeEqual } from 'crypto';
import { AppComponent } from './app.component';
import { BodyblockComponent } from './bodyblock/bodyblock.component';
import { HomeComponent } from './components/home/home.component';
import { FilesComponent } from './files/files.component';
import { NavigationService } from './navigation.service';
import { ChapterService } from './shared/chapter.service';
import { NotesComponent } from './notes/notes.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const appRoutes: Routes = [
  {
    path: '',
    component: BodyblockComponent
  },
  {
    path: 'assets/scriptures/:b/:chap',
    component: BodyblockComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WebviewDirective,
    FilesComponent,
    BodyblockComponent,
    NotesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    // RouterModule.forRoot(appRoutes),
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [ElectronService, NavigationService, ChapterService],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {}
}
