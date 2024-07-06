import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadMovieComponent } from './movie-crud/upload-movie/upload-movie.component';
import { AuthGuard } from './auth/guard/auth.gard';
import { MovieDetailsComponent } from './movie/movie-details/movie-details.component';

const routes: Routes = [
  // {path : "home", component : HomeComponent,},
  // { path: '', redirectTo: 'home', pathMatch: 'full' },
  {path : "upload-movie", component : UploadMovieComponent,canActivate: [AuthGuard], data: {role: ['BasicUser']}},
  {path : "movie-details", component : MovieDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
