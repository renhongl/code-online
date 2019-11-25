import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PenComponent } from './pen/pen.component';
import { AngularSplitModule } from 'angular-split';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { JsDialogComponent } from './pen/js-dialog/js-dialog.component';
import { CssDialogComponent } from './pen/css-dialog/css-dialog.component';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { Routes, RouterModule } from '@angular/router';
import { FullScreenComponent } from './full-screen/full-screen.component';
import { MatTooltipModule } from '@angular/material/tooltip';

const appRoutes: Routes = [
  { path: '', component: PenComponent },
  { path: 'fullScreen', component: FullScreenComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    PenComponent,
    JsDialogComponent,
    FullScreenComponent,
    CssDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes, { useHash: true }),
    BrowserAnimationsModule,
    AngularSplitModule.forRoot(),
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,
    MatSelectModule,
    MatMenuModule,
    MatTooltipModule,
  ],
  entryComponents: [
    JsDialogComponent,
    CssDialogComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
