import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BodyblockComponent } from './bodyblock/bodyblock.component';
import { EditorComponent } from './editor/editor.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { SearchComponent } from './search/search.component';
import { SettingsComponent } from './settings/settings.component';
// import { SearchBarComponent } from './search-bar/search-bar.component';

const routes: Routes = [
  // {
  //   path: 'find-in-page',
  //   component: SearchBarComponent
  // },
  {
    path: 'settings',
    component: SettingsComponent,
  },
  {
    path: 'search/:search',
    component: SearchComponent,
  },
  {
    path: ':book/:chapter',
    component: BodyblockComponent,
  },
  {
    path: 'edit/:book/:chapter',
    component: EditorComponent,
  },
  {
    path: ':chapter',
    component: BodyblockComponent,
  },
  {
    path: 'edit/:chapter',
    component: EditorComponent,
  },
  {
    path: '',
    component: LandingPageComponent,
    pathMatch: 'full',
  },
  {
    path: '**',
    component: BodyblockComponent,
  },
  {
    path: 'edit/**',
    component: EditorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
