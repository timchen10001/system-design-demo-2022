import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { InMemoryCache, ApolloClientOptions, NormalizedCacheObject } from '@apollo/client/core';
import { HttpBatchLink } from 'apollo-angular/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UsersComponent } from './users/users.component';

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      deps: [HttpBatchLink],
      useFactory: (httpLink: HttpBatchLink): ApolloClientOptions<NormalizedCacheObject> => ({
        cache: new InMemoryCache(),
        link: httpLink.create({
          uri: 'http://localhost:3000/graphql',
          batchMax: 5,
          batchInterval: 20,
        }),
      }),
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
