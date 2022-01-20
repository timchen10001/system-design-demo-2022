import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Authenticator } from '../auth/authenticator.service';
import { Tokens } from '../auth/typings/token.interface';
import { LoginUserInput } from '../user/typings/login-user.input';
import { UserService } from '../user/user.service';
import { FormTypes } from './typings/form-type';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  })

  logined = this.auth.authorized;

  formType: FormTypes = 'signin';

  constructor(
    private fb: FormBuilder,
    private auth: Authenticator,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.auth.logined
      .asObservable()
      .subscribe((logined) => {
      this.logined = !!logined;

      if (this.logined) {
        this.router.navigate(['/']);
      }
    });
  }

  onFormTypeChange(type: FormTypes) {
    this.formType = type;
  }
}
