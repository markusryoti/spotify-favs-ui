import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ cookies }) => {
	const accessToken = cookies.get('access_token');
	const sessionToken = cookies.get('session');

	if (accessToken || sessionToken) {
		throw redirect(302, '/dashboard');
	}
}) satisfies PageServerLoad;
