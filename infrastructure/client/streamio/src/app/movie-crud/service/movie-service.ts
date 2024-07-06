import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/service/AuthService';
import { MovieDB } from 'src/app/movie/model/movie.model';
import { environment } from 'src/env/env';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

    constructor(private http: HttpClient, private authService: AuthService) {}

    headers = new HttpHeaders({
        skip: 'true'
    });

    getUploadUrl(movieName: string, uuid: string, resolution: string, title: string,
        description: string, actors: string, directors: string, genres: string): Observable<any>{
		
        let params = new HttpParams()
            .set('movie_name', movieName )
            .set('uuid', uuid)
            .set('resolution', resolution)
            .set('description', description)
            .set('actors', actors)
            .set('directors', directors)
            .set('genres', genres);

        const url =  environment.getUploadUrl ;
		return this.http.get<any>(url, { params });
	}


    getMovieByName(movieName: string): Observable<MovieDB[]>{
        let params = new HttpParams()
            .set('movie_name', movieName);

        const url = environment.getMovie;
        return this.http.get<MovieDB[]>(url, { params });
    }

    getPreviewUrl(movie: string, uuid: string, resolution: string) {
        let params = new HttpParams()
            .set('movie_name', movie)
            .set('uuid', uuid)
            .set('resolution', resolution)
            .set('user', this.authService.username);
        
        const url = environment.getPreviewUrl;
        return this.http.get<any>(url, { params });
    }

    getDownloadUrl(movie: string, uuid: string, resolution: string) {
        let params = new HttpParams()
            .set('movie_name', movie)
            .set('uuid', uuid)
            .set('resolution', resolution)
            .set('user', this.authService.username);
        
        const url = environment.getDownloadUrl;
        return this.http.get<any>(url, { params });
    }

    deleteMovie(movieName: string) {
        let params = new HttpParams()
            .set('directory', movieName);

        const url = environment.deleteMovie;
        return this.http.delete<any>(url, { params });
    }

}