import { Component, OnInit } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  usersObservable: Observable<ApolloQueryResult<unknown>> | undefined;
  loading: boolean = false;
  error: any;
  users: any;

  constructor(private apollo: Apollo) {}

  ngOnInit(): void {
    this.usersObservable = this.apollo.query({
      query: gql`
        {
          users {
            users {
              id
              name
              mobile
            }
          }
        }
      `,
    })
  }

  getUsers() {
    this.usersObservable
      ?.subscribe((result) => {
        console.log({ result });
      });
  }

}
