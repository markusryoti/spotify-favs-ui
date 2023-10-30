<script lang="ts">
	import { getContext } from 'svelte';
	import type { PageData } from './$types';
	import type { Writable } from 'svelte/store';
	import { getWebSocket, sendTrackChange } from '$lib/playerState';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { getArtistName, type CurrentTrack } from '$lib/spotify';
	import type { PlayerStatus } from '$lib/player/buildPlayer';
	import { beforeNavigate } from '$app/navigation';

	export let data: PageData;

	let ws: WebSocket | undefined;
	let userTracks: Map<string, CurrentTrack>;
	let userTrack: CurrentTrack;

	$: userTracks = userTracks;

	let currentTrack = getContext<Writable<PlayerStatus>>('playerStatus');

	let unsub = currentTrack.subscribe(curr => {
		userTrack = curr.track;
		sendCurrent(ws, curr.track);
	});

	$: userTrack = userTrack;

	$: setWebsocketConnection(data.room.id);
	$: sendCurrent(ws, userTrack);

	beforeNavigate(() => {
		console.log('closing ws connection');
		ws?.close();
		unsub();
	});

	async function setWebsocketConnection(roomId: string | undefined) {
		if (browser && roomId) {
			try {
				const { ws: wsConn, userTracks: tracks } = await getWebSocket(
					roomId,
					$page.data.sessionToken
				);
				ws = wsConn;
				tracks.subscribe(t => {
					userTracks = t;
				});
				sendCurrent(ws, userTrack);
			} catch (error) {
				console.error(error);
			}
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

<div class="p-4">
	<h1>{data.room.name}</h1>

	{#if userTracks}
		<ul>
			{#each [...userTracks.keys()] as userId}
				<li>
					<div class="flex items-center">
						<div class="p-6">
							<h4 class="font-semibold">
								{userId}
							</h4>
						</div>
						<div class="flex flex-col p-6">
							<h4 class="font-semibold">{userTracks.get(userId)?.name}</h4>
							<p>{getArtistName(userTracks.get(userId))}</p>
						</div>
						<div class="p-6">
							<span class="">
								<img
									src={userTracks.get(userId)?.album.images[0].url}
									alt=""
									class="w-16 rounded-full"
								/>
							</span>
						</div>
					</div>
				</li>
			{/each}
		</ul>
	{/if}
</div>
