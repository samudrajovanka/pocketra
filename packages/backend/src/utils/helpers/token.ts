import * as jwt from 'jsonwebtoken';

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
