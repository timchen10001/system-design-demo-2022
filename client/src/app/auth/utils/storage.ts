import { TokenName, Tokens } from '../typings/token.interface';

export const setToken = (tokenName: TokenName, token: string): void => {
  localStorage.setItem(tokenName, token);
};

export const setTokens = (tokens: Tokens): void => {
  localStorage.setItem(TokenName.ACCESS_TOKEN, tokens.accessToken);
  localStorage.setItem(TokenName.REFRESH_TOKEN, tokens.refreshToken);
};

export const getToken = (tokenName: TokenName): string => localStorage.getItem(tokenName) || '';

export const removeTokens = (): void => {
  localStorage.removeItem(TokenName.ACCESS_TOKEN);
  localStorage.removeItem(TokenName.REFRESH_TOKEN);
};

export default {
  setToken,
  setTokens,
  getToken,
  removeTokens,
};
