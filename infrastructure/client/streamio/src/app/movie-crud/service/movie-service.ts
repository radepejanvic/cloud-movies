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
        description: string, actors: string, directors: string, genres: string, thumbnail: string): Observable<any>{
		

        let body = {
            'movie_name' : movieName,
            'uuid' : uuid,
            'resolution' : resolution,
            'description' :  description,
            'actors' : actors,
            'directors': directors,
            'genres' : genres,
            'thumbnail' : thumbnail
        }

        const url =  environment.getUploadUrl ;
		return this.http.post<any>(url, body, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        });
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

    getAllMovies(query?: string){
        let params = new HttpParams();
        if(query){
            params = params.set('query', query);
        }

        const url = environment.getAllMovies;
        return this.http.get<MovieDB[]>(url, { params });
    }

    updateMovie(movieName: string,  resolution: string, title: string,
        description: string, actors: string, directors: string, genres: string, thumbnail: string){

        let body = {
            'directory' : movieName,
            'resolution' : resolution,
            'title': title, 
            'description' :  description,
            'actors' : actors,
            'directors': directors,
            'genres' : genres,
            'thumbnail' : thumbnail
        }
        
        const url = environment.updateMovie;
        return this.http.put<any>(url, body, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        });
    }

    isLiked(username:string, movieName: string){
        let params = new HttpParams()
            .set('userId', username)
            .set('directory', movieName);

        const url = environment.isLiked;
        return this.http.get<any>(url, { params });
    }

    postLike(username:string, movieName:string, liked: boolean){
        let body = {
            "userId": username, 
            "directory": movieName, 
            "liked": liked
        }

        const url = environment.postLike;
        return this.http.post<any>(url, body, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        });
    }

    deleteLike(username: string, movieName: string){
        let params = new HttpParams()
        .set('userId', username)
        .set('directory', movieName);

        const url = environment.deleteLike;
        return this.http.delete<any>(url, { params });
    }

}