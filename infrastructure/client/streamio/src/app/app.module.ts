import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Amplify } from 'aws-amplify';
import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular';


Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'eu-central-1_QCJqZH9gR',
      userPoolClientId: 'jnuaqlhr1kb416ikofua705iv'
    }
  }
});

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AmplifyAuthenticatorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
