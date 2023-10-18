import { redirect, type Cookies } from '@sveltejs/kit';

type Fetch = (
	input: RequestInfo | URL,
	init?: RequestInit | undefined
) => Promise<Response>;

type TokenResult = {
	access_token: string;
	token_type: string;
	scope: string;
	expires_in: number;
};

const maxAge = 60 * 59;

export async function getTokensFromRequest(
	cookies: Cookies,
	fetch: Fetch
): Promise<{ accessToken: string; sessionToken: string | undefined }> {
	let accessToken = cookies.get('access_token');
	const refreshToken = cookies.get('refresh_token');
	const sessionToken = cookies.get('session');

	if (accessToken)
		return {
			accessToken,
			sessionToken,
		};

	if (!refreshToken) {
		throw redirect(302, '/login');
	}

	const res = await fetch('http://localhost:8080/refresh-token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			refresh_token: refreshToken,
		}),
	});

	const tokenResult: TokenResult = await res.json();

	accessToken = tokenResult.access_token;

	setCookie(cookies, 'access_token', accessToken);

	return {
		accessToken,
		sessionToken,
	};
}

export function setCookie(cookies: Cookies, name: string, value: string) {
	cookies.set(name, value, {
		path: '/',
		httpOnly: true,
		secure: true,
		maxAge: maxAge,
	});
}
