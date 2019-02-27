import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BodyBlockHolderComponent } from './body-block-holder/body-block-holder.component';
import { BodyblockComponent } from './bodyblock/bodyblock.component';
import { EditorComponent } from './editor/editor.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { BodyBlockParentComponent } from './outlets/body-block-parent/body-block-parent.component';
import { EditorParentComponent } from './outlets/editor-parent/editor-parent.component';
import { LandingPageParentComponent } from './outlets/landing-page-parent/landing-page-parent.component';
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
    path: ':book/:chapter/:language/edit',
    component: EditorParentComponent,
  },
  {
    path: ':book/:chapter/:language',
    component: BodyBlockParentComponent,
  },
  {
    path: ':book/:chapter',
    component: BodyBlockParentComponent,
  },
  {
    path: ':chapter/edit',
    component: EditorParentComponent,
  },
  {
    path: '**/edit',
    component: EditorParentComponent,
  },
  {
    path: ':chapter',
    component: BodyBlockParentComponent,
  },
  {
    path: '',
    component: LandingPageParentComponent,
    pathMatch: 'full',
  },
  {
    path: '**',
    component: BodyBlockParentComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
