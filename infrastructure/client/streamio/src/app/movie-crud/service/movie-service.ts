import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { environment } from 'src/env/env';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

    constructor(private http: HttpClient) {}


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




}