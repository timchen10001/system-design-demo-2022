export enum TokenName {
  ACCESS_TOKEN = 'accessToken',
  REFRESH_TOKEN = 'refreshToken',
}

export type Tokens = { [index in TokenName]: string };
