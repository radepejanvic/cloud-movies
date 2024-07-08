import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/service/AuthService';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit{

  role: string = '';

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    this.role = this.authService.getUserRole()!;
  }

  logOut(): void {
    this.authService.signOut();
  }

}
