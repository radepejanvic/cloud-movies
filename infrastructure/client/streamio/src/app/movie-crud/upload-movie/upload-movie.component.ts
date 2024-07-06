import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../auth/service/AuthService';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MovieService } from '../service/movie-service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-upload-movie',
  templateUrl: './upload-movie.component.html',
  styleUrls: ['./upload-movie.component.css']
})
export class UploadMovieComponent implements OnInit{

  uploadUrl: string = "";
  isFileSelected: boolean = false;
  selectedFile: File | null = null;
  selectedFileName: string = ""; 

  movieTitle: string = "";
  movieDescription: string = "";
  newActor: string = "";
  actors: string[] = [];
  newDirector: string = "";
  directors: string[] = [];
  selectedGenre: string = "";
  genres: string[] = [];

  videoWidth: number = 0;
  videoHeight: number = 0;
  
  predefinedGenres: string[] = ["Action", "Comedy", "Thriller", "Drama", "Horror", "Sci-Fi", "Romance"];

  constructor(private http: HttpClient, 
    private authService: AuthService,
    private movieService: MovieService) {}

  ngOnInit(): void {
    
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file && file.type.startsWith('video/')) {
      this.selectedFile = file;
      this.isFileSelected = true;
      this.selectedFileName = file.name;

      const video = document.createElement('video')
      video.addEventListener('loadedmetadata', event => {
        this.videoWidth = video.videoWidth;
        this.videoHeight = video.videoHeight;
      });
      video.src = URL.createObjectURL(file);
    } else {
      this.selectedFile = null;
      this.isFileSelected = false;
      this.selectedFileName = "";
      console.error('Selected file is not a video.');
    }
  }

  addToList(listType: string) {
    switch(listType) {
      case 'actors':
        if (this.newActor.trim()) {
          this.actors.push(this.newActor.trim());
          this.newActor = '';
        }
        break;
      case 'directors':
        if (this.newDirector.trim()) {
          this.directors.push(this.newDirector.trim());
          this.newDirector = '';
        }
        break;
      case 'genres':
        if (this.selectedGenre && !this.genres.includes(this.selectedGenre)) {
          this.genres.push(this.selectedGenre);
          this.selectedGenre = this.predefinedGenres[0]; 
        }
        break;
    }
  }

  removeFromList(listType: string, index: number) {
    switch(listType) {
      case 'actors':
        this.actors.splice(index, 1);
        break;
      case 'directors':
        this.directors.splice(index, 1);
        break;
      case 'genres':
        this.genres.splice(index, 1);
        break;
    }
  }

  canUpload(): boolean {
    return this.isFileSelected && 
           this.movieTitle.trim() !== '' && 
           this.movieDescription.trim() !== '' && 
           this.actors.length > 0 && 
           this.directors.length > 0 && 
           this.genres.length > 0;
  }

  uploadFile() {
    if (this.selectedFile) {

      const resuloution = this.getVideoResolution();
      const actors = this.processList(this.actors);
      const directors = this.processList(this.directors);
      const genres = this.processList(this.genres);

      this.movieService.getUploadUrl(this.movieTitle, this.generateUUID(),
       resuloution, this.movieTitle, this.movieDescription, actors, directors, genres).subscribe({
        next: (result) => {
            this.uploadUrl = result.upload_url;
            this.sendMovie();
        },
        error: (result) => {
            console.log(result);
        }
      })
    }
  }
  sendMovie() {
      
    const fileBlob = new Blob([this.selectedFile!], { type: this.selectedFile!.type });

    const headers = new HttpHeaders({
      'Content-Type': this.selectedFile!.type,
      skip: 'true'
    });

    this.http.put(this.uploadUrl, fileBlob, { headers: headers, observe: 'response' })
      .subscribe(response => {
        console.log('Upload complete', response);
      }, error => {
        console.error('Upload failed', error);
      });
  }

  processList(inputList: string[]): string {
    const uniqueSorted = [...new Set(inputList)].sort();
  
    return uniqueSorted.join(',');
  }

  generateUUID(): string {
    return uuidv4().split('-')[0];
  }

  getVideoResolution(): string {
    if (!this.videoWidth || !this.videoHeight) {
      return "";
    }
  
    if (this.videoWidth >= 3840 && this.videoHeight >= 2160) {
      return "2160p";
    } else if (this.videoWidth >= 2560 && this.videoHeight >= 1440) {
      return "1440p";
    } else if (this.videoWidth >= 1920 && this.videoHeight >= 1080) {
      return "1080p";
    } else if (this.videoWidth >= 1280 && this.videoHeight >= 720) {
      return "720p";
    } else if (this.videoWidth >= 854 && this.videoHeight >= 480) {
      return "480p";
    } else if (this.videoWidth >= 640 && this.videoHeight >= 360) {
      return "360p";
    } else if (this.videoWidth >= 426 && this.videoHeight >= 240) {
      return "240p";
    } else if (this.videoWidth >= 256 && this.videoHeight >= 144) {
      return "144p";
    } else {
      return ""; 
    }
  }

}

