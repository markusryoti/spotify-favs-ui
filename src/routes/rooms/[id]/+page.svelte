<script lang="ts">
	import { getContext } from 'svelte';
	import type { PageData } from './$types';
	import type { CurrentTrack } from '$lib/player/buildPlayer';
	import type { Writable } from 'svelte/store';
	import { getWebSocket, sendTrackChange } from '$lib/playerState';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';

	export let data: PageData;

	let ws: WebSocket | undefined;

	const currentTrack = getContext<Writable<CurrentTrack>>('currentTrack');

	currentTrack.subscribe(curr => {
		console.log('current in room', curr);
		sendCurrent(ws, curr);
	});

	$: setWebsocketConnection(data.room.id);

	async function setWebsocketConnection(roomId: string | undefined) {
		if (browser && roomId) {
			ws = getWebSocket(roomId, $page.data.sessionToken);
		} else {
			ws = undefined;
		}
	}

	async function sendCurrent(
		ws: WebSocket | undefined,
		track: CurrentTrack | undefined
	) {
		if (!browser || !ws || !track) return;

		if (ws.readyState === ws.OPEN) {
			await sendTrackChange(ws, { track, user_id: null });
		} else {
			console.log('ws connection not open, readyState:', ws.readyState);
		}
	}
</script>

<h1>{data.room.name}</h1>
