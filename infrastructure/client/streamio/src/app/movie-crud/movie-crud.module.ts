import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadMovieComponent } from './upload-movie/upload-movie.component';


@NgModule({
  declarations: [
    UploadMovieComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    UploadMovieComponent
  ]
})
export class MovieCrudModule { }
