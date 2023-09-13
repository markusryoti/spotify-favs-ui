import { getAccessTokenFromRequest } from '$lib/server/token';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies, fetch }) => {
	const token = await getAccessTokenFromRequest(cookies, fetch);

	return json({
		token,
	});
};
