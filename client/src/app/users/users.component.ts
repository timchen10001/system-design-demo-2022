import { Component, OnInit } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';
import { Apollo, gql } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import { User, UserResult } from 'src/generated/graphql';
import { UsersService } from './users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  loading: boolean = false;
  error: any;
  users: User[] = [];

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
  }

  queryUsers() {
    this.loading = true;

    this.usersService.usersObservable
      ?.subscribe({
        next: (query) => {
          console.log({ query });

          if (query.data?.users?.users) {
            this.users = query.data.users.users as User[];
          }

          if (query?.errors?.length) {
            this.error = query.errors;
          }

          this.loading = query.loading;
        },
        error: (error) => this.error = error,
      })
  }

}
