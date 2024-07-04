import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadMovieComponent } from './movie-crud/upload-movie/upload-movie.component';
import { AuthGuard } from './auth/guard/auth.gard';

const routes: Routes = [
  // {path : "home", component : HomeComponent,},
  // { path: '', redirectTo: 'home', pathMatch: 'full' },
  {path : "upload-movie", component : UploadMovieComponent,
     canActivate: [AuthGuard], data: {role: ['BasicUser']}},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
