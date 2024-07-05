import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/service/AuthService';

@Component({
  selector: 'app-upload-movie',
  templateUrl: './upload-movie.component.html',
  styleUrls: ['./upload-movie.component.css']
})
export class UploadMovieComponent implements OnInit{

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.http.get<any>("https://usxc9r50eg.execute-api.eu-central-1.amazonaws.com/upload-url?movie_name=Smeske&uuid=1111&resolution=720p&title=Rainman&description=The very best City of God&actors=Tom Cruise,John Cena,Jason Statham&directors=Akira Kurosawa,Alfred Hitchcock&genres=action,comedy").subscribe({
      next: (result) => {
          console.log(result);
          this.uploadUrl = result.upload_url;
      },
      error: (result) => {
          console.log(result);
      }
    })

  }


  uploadUrl: string = "";
  
  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
        const fileBlob = new Blob([file], { type: file.type });

        const uploadUrl = this.uploadUrl;

        const headers = new HttpHeaders({
            'Content-Type': file.type,
            skip: 'true'
        });

        this.http.put(uploadUrl, fileBlob, { headers: headers, observe: 'response' })
            .subscribe(response => {
                console.log('Upload complete', response);
            }, error => {
                console.error('Upload failed', error);
            });
      }
  }
}
