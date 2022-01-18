import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';
import { UsersComponent } from './users/users.component';
import { AuthorizedGuard } from './auth/guard/authorized.guard';
import { UnAuthorizedGuard } from './auth/guard/un-authorized.guard';

@NgModule({
  imports: [RouterModule.forRoot([
    {
      path: '',
      component: HomeComponent,
      canActivate: [AuthorizedGuard],
    },
    {
      path: 'login',
      component: LoginComponent,
      canActivate: [UnAuthorizedGuard],
    },
    {
      path: 'user',
      component: UserComponent,
      canActivate: [AuthorizedGuard],
    },
    {
      path: 'users',
      component: UsersComponent,
      canActivate: [AuthorizedGuard],
    },
  ])],
  providers: [AuthorizedGuard, UnAuthorizedGuard],
  exports: [RouterModule]
})
export class AppRoutingModule { }
