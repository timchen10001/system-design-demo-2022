import { Injectable } from "@angular/core";
import { CanActivate, Router, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { Authenticator } from "../authenticator.service";

@Injectable()
export class UnAuthorizedGuard implements CanActivate {
  constructor(
    private auth: Authenticator,
    private router: Router,
  ) {}

  canActivate(): Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree {
    if (!this.auth.authorized) {
      return true;
    }

    this.router.navigate(['']);
    
    return false;
  }
}