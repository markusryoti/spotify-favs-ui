import type { Actions, PageServerLoad } from './$types';

export type Room = {
	id: string;
	name: string;
	owner: string;
	created_at: string;
};

export const load = (async ({ cookies }) => {
	const token = cookies.get('session');

	const res = await fetch('http://localhost:8080/rooms', {
		headers: {
			Authorization: `Bearer ${token}`,
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
