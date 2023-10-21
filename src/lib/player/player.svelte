<script lang="ts">
	export let currentTrack: Writable<CurrentTrack>;
	export let roomId: string | undefined;

	import Icon from '@iconify/svelte';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { buildPlayer, type CurrentTrack, type Player } from './buildPlayer';
	import { getWebSocket, sendTrackChange } from '$lib/playerState';
	import type { Writable } from 'svelte/store';

	let player: Player | undefined;
	let currentlyPlaying: CurrentTrack | undefined;
	let artists: string | undefined;
	let ws: WebSocket | undefined;

	const unsub = currentTrack.subscribe(curr => {
		currentlyPlaying = curr;
	});

	$: currentlyPlaying = currentlyPlaying;
	$: artists = currentlyPlaying?.artists.map(a => a.name).join(', ');

	$: setPlayer($page.data.accessToken);
	$: setWebsocketConnection(roomId);
	$: sendCurrent(ws, $page.data.accessToken, currentlyPlaying);

	async function setPlayer(token: string) {
		if (player) return;

		if (browser && token) {
			try {
				console.log('getting new player');
				const p = await buildPlayer(token, currentTrack);

				if (!p) {
					console.error('no player received');
					return;
				}

				player = p;
			} catch (error) {
				console.error('error getting player', error);
				player = undefined;
			}
		}
	}

	async function setWebsocketConnection(roomId: string | undefined) {
		if (browser && roomId) {
			ws = getWebSocket(roomId, $page.data.sessionToken);
		} else {
			ws = undefined;
		}
	}

	async function sendCurrent(
		ws: WebSocket | undefined,
		token: string | undefined,
		track: CurrentTrack | undefined
	) {
		if (!browser || !ws || !track || !token) return;

		if (ws.readyState === ws.OPEN) {
			await sendTrackChange(ws, { track, user_id: null });
		} else {
			console.log('ws connection not open, readyState:', ws.readyState);
		}
	}

	function play() {
		console.log('play clicked, player:', player);
		player?.togglePlay();
	}

	function next() {
		player?.nextTrack();
	}

	function previous() {
		player?.previousTrack();
	}
</script>

{#if currentlyPlaying?.name && player}
	<div class="container bg-surface-800 p-2">
		<div class="main-wrapper">
			<p class="pt-2 text-lg font-bold">{currentlyPlaying.name}</p>
			<p class="pb-1">{artists}</p>
			<div>
				<button on:click={previous}>
					<Icon icon="mdi-light:arrow-left" height="24" />
				</button>
				<button on:click={play}>
					<Icon icon="mdi-light:play" height="26" />
				</button>
				<button on:click={next}>
					<Icon icon="mdi-light:arrow-right" height="24" />
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.main-wrapper {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	button {
		margin: 0 1rem;
	}
</style>
