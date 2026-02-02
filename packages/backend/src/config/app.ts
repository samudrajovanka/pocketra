const appConfig = {
	isVercel: Boolean(process.env.VERCEL_ENV),
	hasCookieDomain: Boolean(process.env.COOKIE_DOMAIN),
};

export default appConfig;
