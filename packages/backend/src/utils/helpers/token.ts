import type { Context } from 'hono';
import * as jwt from 'jsonwebtoken';
import AuthenticationError from '../../exceptions/AuthenticationError';

type DecodedJwt<Payload> = Payload & {
	iat: number;
	exp: number;
};

export const decodeJwt = <Payload>(token: string, secretKey: string) => {
	try {
		const decoded = jwt.verify(token, secretKey) as DecodedJwt<Payload>;
		return decoded;
	} catch (err) {
		if (err instanceof jwt.TokenExpiredError) {
			throw new Error('Token has expired');
		} else if (err instanceof jwt.JsonWebTokenError) {
			throw new Error('Invalid token');
		}

		throw err;
	}
};

export const extractBearerToken = (c: Context) => {
	const authHeader = c.req.header('Authorization');

	if (!authHeader) {
		throw new AuthenticationError('Missing authorization header');
	}

	const [type, token] = authHeader.split(' ');

	if (type !== 'Bearer' || !token) {
		throw new AuthenticationError('Invalid authorization format');
	}

	return token;
};
