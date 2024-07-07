import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadMovieComponent } from './upload-movie/upload-movie.component';
import { FormsModule } from '@angular/forms';
import { UpdateMovieComponent } from './update-movie/update-movie.component';


@NgModule({
  declarations: [
    UploadMovieComponent,
    UpdateMovieComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    UploadMovieComponent,
    UpdateMovieComponent
  ]
})
export class MovieCrudModule { }
