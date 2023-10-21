import { writable } from 'svelte/store';
import type { CurrentTrack } from './spotify';

type WsMessage = {
	track: CurrentTrack;
	user_id: string | null;
};

export function getWebSocket(roomId: string, token: string) {
	const userTracks = writable<Map<string, CurrentTrack>>(
		new Map<string, CurrentTrack>()
	);

	const ws = new WebSocket(
		`ws://localhost:8080/rooms/${roomId}/ws?access_token=${token}`
	);

	ws.onopen = function () {
		console.log('client connected');
	};

	ws.onmessage = function (e) {
		const msg: WsMessage = JSON.parse(e.data);

		const userId = msg.user_id;

		if (!userId) return;

		userTracks.update(curr => {
			curr.set(userId, msg.track);
			return curr;
		});
	};

	ws.onclose = function (e) {
		console.log('ws connection closed');
	};

	return { ws, userTracks };
}

export async function sendTrackChange(ws: WebSocket, msg: WsMessage) {
	ws.send(JSON.stringify(msg));
}
