import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { AdminNavBarComponent } from './admin-nav-bar/admin-nav-bar.component';
import { UserNavBarComponent } from './user-nav-bar/user-nav-bar.component';


@NgModule({
  declarations: [
    NavBarComponent,
    AdminNavBarComponent,
    UserNavBarComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    RouterModule
  ],
  exports: [
    NavBarComponent
  ]
})
export class LayoutModule { }
