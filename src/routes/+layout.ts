import type { LayoutLoad } from './$types';
import type { AuthTokens } from './api/auth/+server';

export const load: LayoutLoad = async ({ fetch, params }) => {
	try {
		const res = await fetch('/api/auth', {
			headers: {
				'content-type': 'application/json',
			},
		});

		if (!res.ok) {
			console.error('Bad status calling auth', res.status);
			return {
				accessToken: '',
				sessionToken: '',
			};
		}

		const sessionData: AuthTokens = await res.json();

		return sessionData;
	} catch (error) {
		console.error(`Error authenticating on layout ${error}`);

		return {
			sessionData: {
				accessToken: '',
				sessionToken: '',
			},
		};
	}
};
