import { Component, inject } from '@angular/core';
import {  MovieDB } from '../model/movie.model';
import { MovieService } from 'src/app/movie-crud/service/movie-service';
import { environment } from 'src/env/env';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-movie-feed',
  templateUrl: './movie-feed.component.html',
  styleUrls: ['./movie-feed.component.css']
})
export class MovieFeedComponent {

  fb = inject(FormBuilder);

  searchForm: FormGroup ;

  constructor(private movieService: MovieService) {
    this.searchForm = this.fb.group({
      searchInput: ['']
    })
  }

  movies: MovieDB[] = [];
  searchText: string = "";


  ngOnInit(){ 
    this.getMovies();
  }

  search() {
    if (this.searchForm.value.searchInput !== ''){
      this.getMovies(this.searchForm.value.searchInput);
    }else{
      this.getMovies();
    }
  }
  
  getMovies(query?: string){
    this.movieService.getAllMovies(query).subscribe({
      next: result => {
        this.movies = result;
      }
    })
  }

}
