import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Authenticator } from '../auth/authenticator.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(
    private auth: Authenticator,
  ) { }

  ngOnInit(): void {
  }

  logoutUser() {
    this.auth.removeTokens();
  }
}
