import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { HttpLink } from 'apollo-angular/http';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UsersComponent } from './users/users.component';
import { UsersService } from './users/users.service';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { UserService } from './user/user.service';
import { UserComponent } from './user/user.component';
import { ApolloService } from './apollo/apollo.service';
import { Authenticator as AuthenticatorService } from './auth/authenticator.service';
import { httpInterceptorProviders } from './http';
import { AppGlobals } from './app-globals.service';

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    LoginComponent,
    HomeComponent,
    UserComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
  ],
  providers: [
    AppGlobals,
    httpInterceptorProviders,
    AuthenticatorService,
    {
      provide: APOLLO_OPTIONS,
      useFactory: ApolloService.Link(AppGlobals.serverHost),
      deps: [HttpLink],
    },
    UsersService,
    UserService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
