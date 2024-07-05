import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/service/AuthService';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
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
