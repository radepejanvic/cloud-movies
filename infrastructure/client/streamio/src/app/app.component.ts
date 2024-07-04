import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/auth/AuthService';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  constructor(private http: HttpClient, private authService: AuthService) {}

  uploadUrl: string = "";
  async ngOnInit(): Promise<void> {

    // let user = await this.authService.getCurrentSession();
    // console.log(user);

		this.http.get<any>("https://g6w4wggyhc.execute-api.eu-central-1.amazonaws.com/upload-url?movie_name=Rambo2&uuid=123123&resolution=480p").subscribe({
      next: (result) => {
          console.log(result);
          this.uploadUrl = result.upload_url;
      },
      error: (result) => {
          console.log(result);
      }
    })

    // console.log(this.authService.getAccessToken());
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
        const formData = new FormData();
        formData.append('file', file);

        const headers = new HttpHeaders({
            'Content-Type': 'application/octet-stream'
        });
        console.log(file.type)
        // Ukloniti nepotrebne dvostruke navodnike
        const uploadUrl = "https://streamio-movies-bucket.s3.amazonaws.com/Rambo1-123123/480p.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAVODE4HJRIKQZ44OG%2F20240704%2Feu-central-1%2Fs3%2Faws4_request&X-Amz-Date=20240704T103301Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=content-type%3Bhost&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDGV1LWNlbnRyYWwtMSJIMEYCIQCvRMEFV0dOvN4xskZTg1sEMPwa%2F4RWvj0mpQU7BGMd9AIhAL59arEtgF60hUn%2FDi46lKqR7chUzFmuagdRVeUM8X2zKsEDCKT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMMzczODczNzE5OTA2Igx4yFvFIpz7NK7fp9oqlQPxW6eYDyMatI27PxTRFqi7PYOKw9pSMW9Y54E1prcdQ7BiIA0uLiUtkZXDouq%2BMDHHSTHBmJHKTO6YxVTeKatPAwrYJ8q0Q%2BZo76pFCZTxA2Pwo999Sr%2B2WzwiLt2jtoXCldhpwM04jbApyaaqwMtDY2kr2uw2XtQ5u7fk8hVftI7dHXCMuMlpLS1V6axsBxxJ7aAxlro3StUs7kgCbVmt%2FmLeIN2lAZ0L%2FmySKVl3Ph8RzK1nItphJSX7BJPZGJBWBFzYB7VDt527jIsZ1Si%2BMWnrlSQDXTEu%2B8VKpVzfbwEfz8loy34cSuczOUFE9jx3iXQ5V6jEBiSHlAVa3Xpg1WrOHLtIPDA1tG05SExnsDv0pZ3d59md9jI%2BRGzhZ%2FJc7OeZlz638zAEsaZfLNSbzAUHWdWv4HuQJz7VemyAZYjZ0zuSv3vVU%2Fti1%2FjUh4bqOKnOf8jJFGJNjFVL9HJFZknWkuqeSKRukl3qqF69dOywSYtCbw71wA3pjy1Iw7414LnNAvH7gZ4Hzq1knqfFvaw6t0Yw3fSZtAY6nQGu7y5GknUIZ7tQz5geWc5NDS1FZk2lz4dWBL1kf9adTGTQsF279lBhVPLOXxwlRoj88PXgQmrkeak%2BjtiBUDZc9Wt8VR8Bd0yqaFqD5gHGDiNuzhIc86GzfFMgHGLfy%2B7trh9VnlIeRE0iaoZMz%2FlJkykM%2BJvEngeLVIzy1hefUnn9puVuHJPWn7m%2FmTHtb1nEJZsv4ci6MWirYrho&X-Amz-Signature=b4c35bb62f5323aff94a0fb4e6daaf3c341ef4b4b8b149ec44b7cbf76fa6fcc6";

        this.http.put(this.uploadUrl, file, { headers: headers, observe: 'response' })
            .subscribe(response => {
                console.log('Upload complete', response);
            }, error => {
                console.error('Upload failed', error);
            });
    }
  }



  title = 'streamio';

  formFields = {
    signUp: {
      given_name: {
        order: 1
      },
      family_name: {
        order: 2
      },
      birthdate: {
        order: 3
      },
      preferred_username: {
        order: 4
      },
      email: {
        order: 5
      },
      password: {
        order: 6
      },
      confirm_password: {
        order: 7
      }
    },
  };
}
