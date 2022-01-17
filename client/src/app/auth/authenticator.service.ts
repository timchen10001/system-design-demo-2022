import { Injectable, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import jwtDecode from 'jwt-decode';
import { EventEmitter as EventEmitter3 } from 'eventemitter3';
import { GraphQLError } from 'graphql';

import { TokenName, Tokens } from './typings/token.interface';
import { ErrorCode } from './enum/error-code';
import { JwtToken } from '../../generated/graphql';
import { Role } from './typings/role.interface';

@Injectable({ providedIn: 'root' })
export class Authenticator extends EventEmitter3 {
  @Output() logined = new EventEmitter<Tokens | undefined>();

  static Events = {
    TOKEN_EXPIRED: 'E/TOKEN_EXPIRED',
    TOKEN_UPDATED: 'E/TOKEN_UPDATED',
  };

  /**
   * error
   */
  private _errorObservable: Map<string, Observable<GraphQLError>> = new Map();

  private _errorStatusCodeSet: Set<string> = new Set();

  private _joinErrorCodeMap: Map<string, Set<string>> = new Map();

  resetError() {
    Array
      .from(this._errorStatusCodeSet.values())
      .forEach((requestKey) => {
        this._errorStatusCodeSet.delete(requestKey);
        this.emit(`${Authenticator.Events.TOKEN_EXPIRED}:${requestKey}`, null);
      });

    this.emit(`${Authenticator.Events.TOKEN_EXPIRED}:ALL`, null);
  }

  registerError(error: GraphQLError) {
    const requestKey = error?.extensions?.['code']
      ? String(error.extensions['code'])
      : null;

    if (requestKey) {
      const relationJoinError = this._joinErrorCodeMap.get(requestKey);

      this.emit(`${Authenticator.Events.TOKEN_EXPIRED}:${requestKey}`, error);

      if (relationJoinError) {
        Array
          .from(relationJoinError.values())
          .forEach((relationErrorCode) => {
            this.emit(`${Authenticator.Events.TOKEN_EXPIRED}:${relationErrorCode}`, error);
          });
      }
    }
  }

  watchErrors(errorCodes?: ErrorCode[]) {
    const requestKey = errorCodes ? JSON.stringify(errorCodes) : 'ALL';

    const storedObservable = this._errorObservable.get(requestKey);

    const observable = storedObservable || new Observable<GraphQLError>((subscriber) => {
      function onUpdate(gqlError: GraphQLError) {
        subscriber.next(gqlError);
      }

      errorCodes?.forEach((errorCode) => {
        const subKey = String(errorCode);

        const joinErrorCodeSet = this._joinErrorCodeMap.get(subKey) || new Set();

        joinErrorCodeSet.add(requestKey);

        this._errorStatusCodeSet.add(subKey);

        this._joinErrorCodeMap.set(subKey, joinErrorCodeSet);
      });

      this.on(`${Authenticator.Events.TOKEN_EXPIRED}:${requestKey}`, onUpdate);
    });

    if (!storedObservable) {
      this._errorObservable.set(requestKey, observable);
    }

    return observable;
  }

  watchError(errorCode: ErrorCode) {
    const requestKey = String(errorCode);

    const storedObservable = this._errorObservable.get(requestKey);

    const observable = storedObservable || new Observable<GraphQLError>((subscriber) => {
      function onUpdate(gqlError: GraphQLError) {
        subscriber.next(gqlError);
      }

      this.on(`${Authenticator.Events.TOKEN_EXPIRED}:${requestKey}`, onUpdate);
    });

    if (!storedObservable && requestKey !== 'ALL') {
      this._errorStatusCodeSet.add(requestKey);
      this._errorObservable.set(requestKey, observable);
    }

    return observable;
  }

  /**
   * update
   */
  private _tokenUpdatedObservable: Observable<boolean> | undefined;

  resetTokenUpdated() {
    this.emit(`${Authenticator.Events.TOKEN_UPDATED}`, false);
  }

  registerTokenUpdated() {
    this.resetError();

    this.emit(`${Authenticator.Events.TOKEN_UPDATED}`, true);
  }

  watchTokenUpdated() {
    if (!this._tokenUpdatedObservable) {
      this._tokenUpdatedObservable = new Observable<boolean>((subscriber) => {
        function onUpdate(tokenUpdated: boolean) {
          subscriber.next(tokenUpdated);
        }

        this.on(`${Authenticator.Events.TOKEN_UPDATED}`, onUpdate);
      });
    }

    return this._tokenUpdatedObservable;
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
    Authenticator.setTokens(tokens);

    this.logined.emit(tokens);

    return this.getTokens();
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