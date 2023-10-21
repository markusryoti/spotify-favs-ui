<script lang="ts">
	import { getContext } from 'svelte';
	import type { PageData } from './$types';
	import type { Writable } from 'svelte/store';
	import { getWebSocket, sendTrackChange } from '$lib/playerState';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { getArtistName, type CurrentTrack } from '$lib/spotify';

	export let data: PageData;

	let ws: WebSocket | undefined;
	let userTracks: Map<string, CurrentTrack>;

	const currentTrack = getContext<Writable<CurrentTrack>>('currentTrack');

	currentTrack.subscribe(curr => {
		sendCurrent(ws, curr);
	});

	$: setWebsocketConnection(data.room.id);

	async function setWebsocketConnection(roomId: string | undefined) {
		if (browser && roomId) {
			const { ws: wsConn, userTracks: tracks } = getWebSocket(
				roomId,
				$page.data.sessionToken
			);
			ws = wsConn;
			tracks.subscribe(t => {
				userTracks = t;
			});
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
<ul>
	{#each [...userTracks.keys()] as userId}
		<li>
			{userId}: {userTracks.get(userId)?.name}
			-
			{getArtistName(userTracks.get(userId))}
		</li>
	{/each}
</ul>
