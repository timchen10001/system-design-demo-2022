import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { HttpClient } from '@angular/common/http';
import { ApolloQueryResult } from '@apollo/client/core';

import { User, MeDocument, QueryUserArgs, UserDocument } from '../../generated/graphql';
import { LoginUserInput } from './typings/login-user.input';
import { AppGlobals } from '../app-globals.service';

@Injectable()
export class UserService {
  constructor(
    private apollo: Apollo,
    private http: HttpClient,
  ) {}

  getMeObservable():Observable<ApolloQueryResult<User>> {
    return this.apollo.query({
      query: MeDocument,
      fetchPolicy: 'network-only',
    });
  }

  getUserObservable(variables: QueryUserArgs): Observable<ApolloQueryResult<User>> {
    return this.apollo.query({
      query: UserDocument,
      variables,
      fetchPolicy: 'network-only',
    })
  }

  getLoginUserObservable(loginUserArgs: LoginUserInput) {
    return this.http.post(`${AppGlobals.serverHost}/login/user`, {
      email: loginUserArgs.email,
      password: loginUserArgs.password,
    });
  }
}
