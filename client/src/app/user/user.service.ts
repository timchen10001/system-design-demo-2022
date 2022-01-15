import { Injectable } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { User, MeDocument, QueryUserArgs, UserDocument } from '../../generated/graphql';

@Injectable()
export class UserService {
  meObservable$: Observable<ApolloQueryResult<User>> | undefined;
  private userObservable$: Observable<ApolloQueryResult<User>> | undefined;

  constructor(private apollo: Apollo) {
    this.meObservable$ = this.apollo.query({
      query: MeDocument,
      fetchPolicy: 'network-only',
    });
  }

  getUserObservable(variables: QueryUserArgs) {
    this.userObservable$ = this.apollo.query({
      query: UserDocument,
      variables,
      fetchPolicy: 'network-only',
    })

    return this.userObservable$;
  }
}
