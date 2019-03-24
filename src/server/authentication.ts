import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import { UserError, HttpStatus } from '~/modules/common';

interface IRawJwTUser {
  iat: number;
  exp: number;
  email: string;
  scopes?: string[];
}
export interface IJwTUser {
  iat: Date;
  exp: Date;
  email: string;
  scopes?: string[];
}

export const jwtVerify = (token: string, secret: string, scopes?: string[]) =>
  new Promise<IJwTUser>((res, rej) => {
    jwt.verify(token, secret, function(err, decoded: IRawJwTUser) {
      if (err) {
        rej(err);
      } else {
        // Check if JWT contains all required scopes
        for (let scope of scopes) {
          if (!decoded.scopes.includes(scope)) {
            rej(new UserError(HttpStatus.FORBIDDEN, 'JWT does not contain required scope.'));
          }
        }
        // eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
        res({
          ...decoded,
          iat: new Date(decoded.iat * 1000),
          exp: new Date(decoded.exp * 1000),
          scopes: decoded.scopes || [],
        } as IJwTUser);
      }
    });
  });

export async function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes?: string[],
): Promise<IJwTUser> {
  if (securityName === 'jwt') {
    const token = request.body.token || request.query.token || request.headers['authorization'];

    if (!token) {
      throw new UserError(HttpStatus.UNAUTHORIZED, 'No token provided');
    }
    return await jwtVerify(token, process.env.SECRET, scopes);
  }
}
