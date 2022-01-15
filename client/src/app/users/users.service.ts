import { Observable } from 'rxjs';
import { Injectable } from "@angular/core";
import { ApolloQueryResult } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import { UsersDocument, UsersQuery } from '../../generated/graphql';

@Injectable()
export class UsersService {
  usersObservable: Observable<ApolloQueryResult<UsersQuery>> | undefined;

  constructor(private apollo: Apollo) {
    this.usersObservable = this.apollo.query({
      query: UsersDocument,
      fetchPolicy: 'network-only',
    });
  }
}