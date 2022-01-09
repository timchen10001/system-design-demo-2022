import { Observable } from 'rxjs';
import { EventEmitter } from 'eventemitter3';
import { GraphQLError } from 'graphql';
import { TokenName } from '../typings/token.interface';
import { ErrorCode } from '../enum/error-code';
import { getToken } from '../utils/storage';

class Authenticator extends EventEmitter {
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

  get tokenExpired() {
    return [
      ErrorCode.UNAUTHORIZED_DEFAULT,
      ErrorCode.UNAUTHORIZED_EXPIRED_TOKEN,
      ErrorCode.UNAUTHORIZED_INVALID_TOKEN,
    ].some((err) => !!this._errorStatusCodeSet.has(String(err)));
  }

  // eslint-disable-next-line class-methods-use-this
  get accessToken() {
    return getToken(TokenName.ACCESS_TOKEN);
  }
}

const authenticator = new Authenticator();

export default authenticator;
