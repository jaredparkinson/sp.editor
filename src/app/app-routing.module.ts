import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { BodyblockComponent } from './bodyblock/bodyblock.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  {
    path: 'search/:s/:chap',
    component: AppComponent
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
    component: AppComponent,
    pathMatch: 'full'
  },
  {
    path: '**',
    component: AppComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
