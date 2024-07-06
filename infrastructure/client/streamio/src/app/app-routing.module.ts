import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadMovieComponent } from './movie-crud/upload-movie/upload-movie.component';
import { AuthGuard } from './auth/guard/auth.gard';
import { MovieDetailsComponent } from './movie/movie-details/movie-details.component';
import { MovieFeedComponent } from './movie/movie-feed/movie-feed.component';

const routes: Routes = [
  // {path : "home", component : HomeComponent,},
  { path: '', redirectTo: 'feed', pathMatch: 'full' },
  {path : "upload-movie", component : UploadMovieComponent,canActivate: [AuthGuard], data: {role: ['BasicUser']}},
  {path : "movie-details", component : MovieDetailsComponent},
  {path : "feed", component : MovieFeedComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
