import { Injectable } from "@angular/core";
import jwtDecode from 'jwt-decode';
import { InMemoryCache, ApolloLink } from '@apollo/client/core';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import { HttpLink } from "apollo-angular/http";

import authenticator, { Authenticator } from '../auth/authenticator.service';
import { Role } from './role';
import { TokenName } from "../auth/typings/token.interface";

/**
 * @ref https://apollo-angular.com/docs/recipes/authentication/
 * @param httpLink 
 * @returns 
 */
@Injectable()
export class ApolloService {
  static Link = (host: string) => function createApolloLink(httpLink: HttpLink) {      
    const http = httpLink.create({ uri: `${host}/graphql` });
  
    const basic = setContext((operation, context) => ({
      headers: { Accept: 'charset=utf-8' }
    }));
  
    // Get the authentication token from local storage if it exists
    const auth = setContext(async (_, context) => {
      const { headers } = context;
  
      let accessToken = Authenticator.getToken(TokenName.ACCESS_TOKEN);
    
      if (accessToken) {
        const roleInfo = jwtDecode<Role>(accessToken);
        const now = Date.now() / 1000;
        const tokenExpired = roleInfo.exp < now;
    
        if (tokenExpired) {
          const tokenRefreshResponse = await Authenticator.refreshToken(
            host,
            {
              accessToken,
              refreshToken: Authenticator.getToken(TokenName.REFRESH_TOKEN),
            },
            headers,
          );
    
          if (tokenRefreshResponse?.accessToken) {
            accessToken = tokenRefreshResponse.accessToken;
            Authenticator.setToken(TokenName.ACCESS_TOKEN, tokenRefreshResponse.accessToken);
          }
        }
      }
    
      return {
        headers: {
          ...headers,
          ...accessToken ? {
            Authorization: `Bearer ${accessToken}`,
          } : {},
        },
      };
    });
  
    const error = onError(({
      graphQLErrors,
      networkError,
    }) => {
      if (graphQLErrors) {
        graphQLErrors.forEach((graphQLError) => {
          const {
            extensions: { code },
            message,
            locations,
            path,
          } = graphQLError;
    
          authenticator.registerError(graphQLError);
          console.error(`[GraphQL error]: Code: ${code}, Message: ${message}, Location: ${locations}, Path: ${path}`);
        });
      }
    
      if (networkError) {
        console.error(networkError);
      }
    });
  
    // const ws = new WebSocketLink({
    //   uri: `ws://localhost/v1/graphql`,
    //   options: {
    //     reconnect: true,
    //     connectionParams: {
    //       headers: {
    //         "x-hasura-admin-secret": "mysecretkey"
    //       }
    //     }
    //   }
    // });
  
    return {
      link: ApolloLink.from([basic, auth, error, http]),
      cache: new InMemoryCache(),
    };
  }
}