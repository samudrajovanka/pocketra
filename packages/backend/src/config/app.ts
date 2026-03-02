const appConfig = {
	isVercel: Boolean(process.env.VERCEL_ENV),
	hasCookieDomain: Boolean(process.env.COOKIE_DOMAIN),
	domain: 'jovan.id',
};

export default appConfig;
