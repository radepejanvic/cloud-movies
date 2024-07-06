import { Injectable, OnInit } from '@angular/core';
import { AuthUser, getCurrentUser, signOut, fetchAuthSession, AuthTokens } from 'aws-amplify/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userRole = "";
  accessToken : string = "";
  username: string = "";

  constructor() {
    this.accessToken = this.getLocalStorageItemByKeySubstring('accessToken');
    this.username = this.getLocalStorageItemByKeySubstring('LastAuthUser');
    this.userRole = this.getUserRole()!;
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

  getUserRole(): string | undefined {
    return this.extractRoleFromJwt(this.getLocalStorageItemByKeySubstring('accessToken'));
  }

  signOut() {
    signOut();
  }


  getLocalStorageItemByKeySubstring(substring: string) {
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        if (key != null && key.includes(substring)) {
            return localStorage.getItem(key) || '';
        }
    }
    return ''; 
  }

  extractRoleFromJwt(token: string): string | undefined {
    try {
      // Split the JWT into its three parts
      const payloadPart = token.split('.')[1];
      
      // Decode the Base64 URL encoded payload
      const decodedPayload = atob(payloadPart.replace(/-/g, '+').replace(/_/g, '/'));
      
      // Parse the JSON payload
      const payload = JSON.parse(decodedPayload);
      
      // Extract the role. Adjust the key based on where the role is stored in the token.
      const role = payload['custom:role'] || (payload['cognito:groups'] && payload['cognito:groups'][0]);
      
      return role;
    } catch (error) {
      console.error('Error extracting role from JWT:', error);
      return undefined;
    }
  }
}

