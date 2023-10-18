import { getTokensFromRequest } from '$lib/server/token';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export type AuthTokens = {
	sessionToken: string | undefined;
	accessToken: string | undefined;
};

export const GET: RequestHandler = async ({ cookies, fetch }) => {
	const tokens = await getTokensFromRequest(cookies, fetch);

	return json(tokens);
};
