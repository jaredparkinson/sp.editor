import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { BodyblockComponent } from './bodyblock/bodyblock.component';
import { HomeComponent } from './components/home/home.component';
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
    component: SettingsComponent
  },
  {
    path: 'search/:search',
    component: SearchComponent
  },
  {
    path: ':book/:chapter',
    component: BodyblockComponent
  },
  {
    path: ':chapter',
    component: BodyblockComponent
  },
  {
    path: '',
    component: LandingPageComponent,
    pathMatch: 'full'
  },
  {
    path: '**',
    component: BodyblockComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
