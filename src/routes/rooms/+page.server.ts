import { getTokensFromRequest } from '$lib/server/token';
import type { Actions, PageServerLoad } from './$types';

export type Room = {
	id: string;
	name: string;
	owner: string;
	created_at: string;
};

export const load = (async ({ cookies, fetch }) => {
	const tokens = await getTokensFromRequest(cookies, fetch);

	const res = await fetch('http://localhost:8080/rooms', {
		headers: {
			Authorization: `Bearer ${tokens.sessionToken}`,
		},
	});
	const rooms: Room[] = await res.json();

	return {
		rooms,
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ cookies, request, fetch }) => {
		const token = cookies.get('session');
		const data = await request.formData();
		const name = data.get('name');

		if (!name) {
			throw new Error('invalid name');
		}

		const res = await fetch('http://localhost:8080/add-room', {
			method: 'POST',
			body: JSON.stringify({
				room_name: name,
			}),
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
		});

		const room: Room = await res.json();
		console.log(room);
	},
} satisfies Actions;
