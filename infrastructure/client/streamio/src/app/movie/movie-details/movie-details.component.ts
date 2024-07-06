import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/service/AuthService';
import { MovieService } from 'src/app/movie-crud/service/movie-service';
import { DialogService } from 'src/app/shared/service/dialog-service';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent implements OnInit{
  @ViewChild('videoElement') videoElement!: ElementRef;
  
  constructor(private route: ActivatedRoute,
     private movieService: MovieService,
     private cdr: ChangeDetectorRef,
     private authService: AuthService,
     private dialogService: DialogService,
     private router: Router) {}
  
  movieName: string = "";
  movie: string = "";
  uuid: string = "";

  resolutions: any = [];
  currentResolutionUrl = "";
  currentResolution = "";

  actors: string[] = [];
  directors: string[] = [];
  genres: string[] = [];
  description: string = "";

  userRole: string = "";

  ngOnInit(){
    this.route.queryParams.subscribe(params => {
      console.log(params);
      this.movieName = params['movie_name'];
      this.movie = params['movie_name'].split('-')[0];
      this.uuid = params['movie_name'].split('-')[1];
   });

  this.userRole = this.authService.userRole;

  // this.movieName = "TDF-1111";
  // this.movie = this.movieName.split('-')[0];
  // this.uuid = this.movieName.split('-')[1];

   this.movieService.getMovieByName(this.movieName).subscribe({
    next: (result) => {
      console.log(result)
      result.forEach((element) => {
        this.movieService.getPreviewUrl(this.movie, this.uuid, element.resolution?.S!).subscribe({
          next: result => {
            this.resolutions = [...this.resolutions, { label: element.resolution?.S, url: result.upload_url }];
            this.resolutions.sort((a: { label: string; }, b: { label: any; }) => a.label.localeCompare(b.label));
            
            if (this.currentResolutionUrl === "") {
              this.currentResolutionUrl = this.resolutions[0].url;
              this.currentResolution = this.resolutions[0].label;
              this.playVideo(this.currentResolutionUrl);
            }
            this.cdr.detectChanges();
          }
        });

        if(element.actors){
          console.log("asdasd")
          this.actors = element.actors!.S.split(',');
          this.directors = element.directors!.S.split(',');
          this.genres = element.genres!.S.split(',');
          this.description = element.description!.S;
        }
        
      });
    },
    error: (result) => {
      console.log("Error: ", result)
    }

   })
  }

  changeResolution(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedUrl = selectElement.value;
    
    this.currentResolutionUrl = selectedUrl;
  
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    this.currentResolution = selectedOption.text;

    this.playVideo(this.currentResolutionUrl);
  }

  playVideo(url: string): void {
    const video: HTMLVideoElement = this.videoElement.nativeElement;
    video.src = url;
    video.load();
    video.play();
  }

  downloadMovie(){
    this.movieService.getDownloadUrl(this.movie, this.uuid, this.currentResolution).subscribe({
      next: result => {
        fetch(result.upload_url)
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.blob(); 
          })
          .then(blob => {
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `${this.movie}.mp4`; 
            document.body.appendChild(a);
            a.click();
            a.remove();

            window.URL.revokeObjectURL(downloadUrl);
          })
          .catch(error => {
            console.error('Error fetching the file:', error);
          });
      }
    })
  }


  deleteMovie(){
    this.dialogService
		  .confirmDialog({
			title: 'Are you sure?',
			message: "You're data will be lost",
			confirmCaption: 'Yes',
			cancelCaption: 'No',
		  })
		  .subscribe((yes: any) => {
			if (yes) this.movieService.deleteMovie(this.movieName).subscribe({
        next: result => {
          this.router.navigate([""]);
        }
      });
		  });
    
  }


}
