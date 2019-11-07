import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularSplitModule } from 'angular-split';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { PenComponent } from './pen/pen.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'pen', component: PenComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PenComponent
  ],
  imports: [
    BrowserModule,
    AngularSplitModule.forRoot(),
    RouterModule.forRoot(appRoutes, { useHash: true })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
