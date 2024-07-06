import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieDetailsComponent } from './movie-details/movie-details.component';
import { MovieFeedComponent } from './movie-feed/movie-feed.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    MovieDetailsComponent,
    MovieFeedComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    MovieDetailsComponent,
    MovieFeedComponent
  ]
})
export class MovieModule { }
