import { writable, type Writable } from 'svelte/store';
import type { CurrentTrack } from './spotify';

type WsMessage = {
	track: CurrentTrack;
	user_id: string | null;
};

type IncomingWsMessage = {
	[userId: string]: CurrentTrack;
};

export function getWebSocket(
	roomId: string,
	token: string
): Promise<{ ws: WebSocket; userTracks: Writable<Map<string, CurrentTrack>> }> {
	const userTracks = writable<Map<string, CurrentTrack>>(
		new Map<string, CurrentTrack>()
	);

	return new Promise((resolve, reject) => {
		const ws = new WebSocket(
			`ws://localhost:8080/rooms/${roomId}/ws?access_token=${token}`
		);

		ws.onopen = function () {
			console.log('ws connection created');
			resolve({ ws, userTracks });
		};

		ws.onmessage = function (e) {
			const msg: IncomingWsMessage = JSON.parse(e.data);

			userTracks.update(_curr => {
				const m = new Map<string, CurrentTrack>();
				Object.keys(msg).forEach(k => m.set(k, msg[k]));
				return m;
			});
		};

		ws.onclose = function (e) {
			console.log('ws connection closed');
		};
	});
}

export async function sendTrackChange(ws: WebSocket, msg: WsMessage) {
	ws.send(JSON.stringify(msg));
}
