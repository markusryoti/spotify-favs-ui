import type { Room } from '../+page.server';
import type { PageServerLoad } from './$types';

export const load = (async ({ fetch, params, cookies }) => {
	const token = cookies.get('session');
	const roomId = params.id;

	const res = await fetch(`http://localhost:8080/rooms/${roomId}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	const room: Room = await res.json();

	return {
		room,
	};
}) satisfies PageServerLoad;
