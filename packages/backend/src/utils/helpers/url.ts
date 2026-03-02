export const getRootDomain = (host: string) => {
	const hostname = host.split(':')[0];

	if (hostname === 'localhost') {
		return hostname;
	}

	const regex = /^([a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)/;
	const match = hostname.match(regex);
	if (!match) {
		throw new Error('Invalid host');
	}

	const splitHost = hostname.split('.');

	if (splitHost.length >= 2) {
		return splitHost.slice(-2).join('.');
	}

	return hostname;
};
