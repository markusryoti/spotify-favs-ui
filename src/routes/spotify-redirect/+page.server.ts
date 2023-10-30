import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { setCookie } from '$lib/server/token';

type TokenResponse = {
	access_token: string;
	token_type: string;
	scope: string;
	expires_in: number;
	refresh_token: string;
	session: string;
};

export const load = (async ({ fetch, url, cookies }) => {
	const data = {
		code: url.searchParams.get('code'),
		state: url.searchParams.get('state'),
		error: url.searchParams.get('error'),
	};

	if (!data.error) {
		const newUrl = `http://localhost:8080/create-session?code=${data.code}&state=${data.state}`;
		const res = await fetch(newUrl);
		const responseData: TokenResponse = await res.json();

		setCookie(cookies, 'access_token', responseData.access_token);
		setCookie(cookies, 'refresh_token', responseData.refresh_token);
		setCookie(cookies, 'session', responseData.session);

		throw redirect(302, '/current-favorites');
	} else {
		return {
			error: data.error,
		};
	}
}) satisfies PageServerLoad;
