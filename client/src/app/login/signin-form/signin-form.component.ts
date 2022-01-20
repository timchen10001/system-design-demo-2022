import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { LoginUserInput } from '../../user/typings/login-user.input';
import { Authenticator } from '../../auth/authenticator.service';
import { UserService } from '../../user/user.service';
import { FormTypes } from '../typings/form-type';
import { Tokens } from '../../auth/typings/token.interface';

@Component({
  selector: 'signin-form',
  templateUrl: './signin-form.component.html',
  styleUrls: ['./signin-form.component.scss']
})
export class SigninFormComponent implements OnInit {
  signinForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  })

  @Output()
  changedFormType = new EventEmitter<FormTypes>();

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private auth: Authenticator,
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    const signinArgs: LoginUserInput = this.signinForm.value;

    this.userService
      .getLoginUserObservable(signinArgs)
      .subscribe(
        (loginUserResponse) => {
          this.auth.updateTokens(loginUserResponse as Tokens);
        },
      );
  }

  onFormTypeChange(type: FormTypes) {
    this.changedFormType.next(type);
  }
}
