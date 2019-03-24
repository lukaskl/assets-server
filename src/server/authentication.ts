import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import { UserError, HttpStatus } from '~/modules/common';

export async function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes?: string[],
): Promise<any> {
  if (securityName === 'jwt') {
    const token = request.body.token || request.query.token || request.headers['authorization'];

    if (!token) {
      throw new UserError(HttpStatus.UNAUTHORIZED, 'No token provided');
    }
    jwt.verify(token, process.env.SECRET, function(err: any, decoded: any) {
      if (err) {
        throw err;
      } else {
        // Check if JWT contains all required scopes
        for (let scope of scopes) {
          if (!decoded.scopes.includes(scope)) {
            throw new UserError(HttpStatus.FORBIDDEN, 'JWT does not contain required scope.');
          }
        }
        return decoded;
      }
    });
  }
}
