export const getRootDomain = (host: string) => {
	const url = new URL(host);
	const splitHost = url.hostname.split('.');

	if (splitHost.length === 2) {
		return url.hostname;
	}

	return splitHost.slice(-2).join('.');
};
