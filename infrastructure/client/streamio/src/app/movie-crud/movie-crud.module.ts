import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadMovieComponent } from './upload-movie/upload-movie.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    UploadMovieComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    UploadMovieComponent
  ]
})
export class MovieCrudModule { }
