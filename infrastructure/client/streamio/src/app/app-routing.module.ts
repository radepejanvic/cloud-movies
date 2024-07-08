import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadMovieComponent } from './movie-crud/upload-movie/upload-movie.component';
import { AuthGuard } from './auth/guard/auth.gard';
import { MovieDetailsComponent } from './movie/movie-details/movie-details.component';
import { MovieFeedComponent } from './movie/movie-feed/movie-feed.component';
import { UpdateMovieComponent } from './movie-crud/update-movie/update-movie.component';
import { UserSubscriptionsComponent } from './movie/user-subscriptions/user-subscriptions.component';

const routes: Routes = [
  // {path : "home", component : HomeComponent,},
  { path: '', redirectTo: 'feed', pathMatch: 'full' },
  {path : "upload-movie", component : UploadMovieComponent, canActivate: [AuthGuard], data: {role: ['Admin']}},
  {path : "movie-details", component : MovieDetailsComponent},
  {path : "feed", component : MovieFeedComponent},
  {path : "update-movie", component : UpdateMovieComponent, canActivate: [AuthGuard], data: {role: ['Admin']}},
  {path : "subscriptions", component : UserSubscriptionsComponent, canActivate: [AuthGuard], data: {role: ['BasicUser']}},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
