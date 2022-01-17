import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Authenticator } from '../auth/authenticator.service';
import { Tokens } from '../auth/typings/token.interface';
import { LoginUserInput } from '../user/typings/login-user.input';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  })

  logined = this.auth.authorized;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private auth: Authenticator,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.auth.logined.asObservable().subscribe((logined) => {
      this.logined = !!logined;

      if (this.logined) {
        this.router.navigate(['/']);
      }
    });
  }

  onSubmit() {
    const loginArgs: LoginUserInput = this.loginForm.value;

    const loginUser$ = this.userService.getLoginUserObservable(loginArgs);

    loginUser$.subscribe(
      (loginUserResponse) => {
        this.auth.updateTokens(loginUserResponse as Tokens);
      },
    );
  }
}
