import type { CurrentTrack } from './player/buildPlayer';

type WsMessage = {
	track: CurrentTrack;
	user_id: string | null;
};

export function getWebSocket(roomId: string, token: string) {
	const ws = new WebSocket(
		`ws://localhost:8080/rooms/${roomId}/ws?access_token=${token}`
	);

	ws.onopen = function () {
		console.log('client connected');
	};

	ws.onmessage = function (e) {
		const msg: WsMessage = JSON.parse(e.data);
		console.log('got ws msg', msg);
	};

	ws.onclose = function (e) {
		console.log('ws connection closed');
	};

	return ws;
}

export async function sendTrackChange(ws: WebSocket, msg: WsMessage) {
	ws.send(JSON.stringify(msg));
}
