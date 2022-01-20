import { Injectable, Output, EventEmitter, OnInit } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { EventEmitter as EventEmitter3 } from 'eventemitter3';

import { TokenName, Tokens } from './typings/token.interface';
import { JwtToken } from '../../generated/graphql';
import { Role } from './typings/role.interface';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class Authenticator {
  @Output()
  logined = new EventEmitter<Tokens | undefined>();

  constructor(private router: Router) {
    this.logined
      .asObservable()
      .subscribe((tokens) => {
        if (!tokens) {
          this.router.navigateByUrl('/login');
        }
      })
  }

  static refreshToken (
    host: string,
    jwtToken: Pick<JwtToken, 'accessToken' | 'refreshToken'>,
    headers: any
  ) {
    return fetch(`${host}/accessToken`, {
      method: 'POST',
      body: JSON.stringify({
        refreshToken: jwtToken.refreshToken
      }),
      headers: {
        ...headers,
        ...jwtToken.accessToken ? {
          Authorization: `Bearer ${jwtToken.accessToken}`,
        } : {},
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json()) as Promise<JwtToken>
  }

  static getToken (tokenName: TokenName): string {
    return localStorage.getItem(tokenName) || '';
  }

  getTokens() {
    const accessToken = Authenticator.getToken(TokenName.ACCESS_TOKEN);
    const refreshToken = Authenticator.getToken(TokenName.REFRESH_TOKEN);

    return accessToken && refreshToken ? {
      accessToken,
      refreshToken
    } : undefined;
  }

  static setTokens = (tokens: Tokens): void => {
    localStorage.setItem(TokenName.ACCESS_TOKEN, tokens.accessToken);
    localStorage.setItem(TokenName.REFRESH_TOKEN, tokens.refreshToken);
  };

  static setToken (tokenName: TokenName, token: string): void {
    localStorage.setItem(tokenName, token);
  };

  static removeTokens (): void {
    localStorage.removeItem(TokenName.ACCESS_TOKEN);
    localStorage.removeItem(TokenName.REFRESH_TOKEN);
  };

  updateTokens(tokens: Tokens) {
    if (!tokens?.accessToken || !tokens?.refreshToken) return;

    Authenticator.setTokens(tokens);

    this.logined.emit(tokens);

    return this.getTokens();
  }

  removeTokens() {
    Authenticator.removeTokens();

    this.logined.emit(undefined);
  }

  get accessToken() {
    return this.getTokens()?.accessToken;
  }

  get authorized() {
    return !!this.accessToken;
  }

  get roleInfo() {
    if (!this.accessToken) return undefined;

    return jwtDecode<Role | undefined>(this.accessToken);
  }
}