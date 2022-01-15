import { JwtToken } from '../../../generated/graphql';

const refreshToken = (jwtToken: Pick<JwtToken, 'accessToken' | 'refreshToken'>, headers: any) => fetch('http://localhost:3000/accessToken', {
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
}).then((response) => response.json()) as Promise<JwtToken>;

export default refreshToken;
