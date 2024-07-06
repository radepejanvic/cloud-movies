import { Component } from '@angular/core';
import { MovieCard } from '../model/movie.model';
import { MovieService } from 'src/app/movie-crud/service/movie-service';
import { environment } from 'src/env/env';

@Component({
  selector: 'app-movie-feed',
  templateUrl: './movie-feed.component.html',
  styleUrls: ['./movie-feed.component.css']
})
export class MovieFeedComponent {

  constructor(private movieService: MovieService) {}

  imageBase64: string = "";
  movies: MovieCard[] = [];


  ngOnInit(){
    this.movieService.getAllMovies("").subscribe({
      next: result => {
        this.movies = result;
        console.log(result)
      }
    })

    this.imageBase64 = environment.imageBase64;
  }
}
