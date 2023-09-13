import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ fetch }) => {
	try {
		const res = await fetch('/api/auth', {
			headers: {
				'content-type': 'application/json',
			},
		});
		const sessionData: { token: string } = await res.json();

		return {
			sessionData,
		};
	} catch (error) {
		console.error(`Error authenticating on layout ${error}`);

		return {
			sessionData: { token: '' },
		};
	}
};
