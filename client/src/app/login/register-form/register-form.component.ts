import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FormTypes } from '../typings/form-type';

@Component({
  selector: 'register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent implements OnInit {
  reigsterForm = this.fb.group({
    username: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
    retypePassword: ['', Validators.required]
  });

  @Output()
  changedFormType = new EventEmitter<FormTypes>();

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    console.log({ form: this.reigsterForm.value });
  }

  onFormTypeChange(type: FormTypes) {
    this.changedFormType.next(type);
  }

}
