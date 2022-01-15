import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApolloQueryResult } from '@apollo/client/core';
import { Observable, switchMap } from 'rxjs';
import { User } from '../../generated/graphql';
import { UserService } from './user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  user!: User;
  user$!: Observable<ApolloQueryResult<User>>;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.user$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const userId = params.get('userId')

        console.log({ userId });

        return this.userService.getUserObservable({ id: userId || '' });
      })
    )
  }

  getUser() {
    this.user$.subscribe((userQuery) => {
      this.user = userQuery.data;
    });
  }
}
