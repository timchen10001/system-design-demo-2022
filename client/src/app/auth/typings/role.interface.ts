export type Role = {
  id: string,
  roles: ('ADMIN' | 'USER')[],
  tokenType: 'ACCESS_TOKEN' | 'REFRESH_TOKEN',
  iat: number,
  exp: number,
};

