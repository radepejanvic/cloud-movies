import { Injectable, OnInit } from '@angular/core';
import { AuthUser, getCurrentUser, signOut, fetchAuthSession, AuthTokens } from 'aws-amplify/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit{

  accessToken = "";

  constructor() { }
  ngOnInit(): void {
    this.getAccessToken().then(accessTokenString => {
      if (accessTokenString) {
          this.accessToken = accessTokenString;
          console.log(this.accessToken);
      } 
    }).catch(error => {
        console.error('Greška pri dobijanju access tokena:', error);
    });;
  }


  async getCurrentUser(): Promise<AuthUser> {
    return await getCurrentUser();
  }

  async getCurrentSession(): Promise<AuthTokens | undefined> {
    return (await fetchAuthSession()).tokens;
  }

  async getCurrentUserFullName(): Promise<string | undefined> {
    let cognitoToken = await (await fetchAuthSession()).tokens;
    return cognitoToken?.idToken?.payload['name']?.toString();
  }

  async getAccessToken(): Promise<string | undefined> {
    let cognitoToken = await (await fetchAuthSession()).tokens;
    return cognitoToken?.accessToken.toString();
  }

  signOut() {
    signOut();
  }

}

