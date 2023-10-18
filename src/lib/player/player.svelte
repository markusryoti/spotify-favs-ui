<script lang="ts">
	import Icon from '@iconify/svelte';

	export let session: AuthTokens;
	export let roomId: string | undefined;

	import { browser } from '$app/environment';
	import { buildPlayer, type CurrentTrack, type Player } from './buildPlayer';
	import { onDestroy } from 'svelte';
	import type { Unsubscriber } from 'svelte/store';
	import { getWebSocket, sendTrackChange } from '$lib/playerState';
	import type { AuthTokens } from '../../routes/api/auth/+server';

	let player: Player | undefined;
	let currentTrack: CurrentTrack | undefined;
	let artists: string;
	let ws: WebSocket | undefined;
	let unsub: Unsubscriber | undefined;

	$: ws = ws;
	$: unsub = unsub;
	$: session.accessToken && setPlayer(session.accessToken);
	$: currentTrack = currentTrack;
	$: artists = artists;

	$: setWebsocketConnection(roomId);
	$: sendCurrent(ws, session.accessToken, currentTrack);

	async function setPlayer(token: string) {
		console.log('getting new player');

		if (browser && token) {
			try {
				const playerRes = await buildPlayer(token);

				if (!playerRes || !playerRes?.player) {
					console.error('no player received');
					return;
				}

				player = playerRes.player;

				unsub = playerRes.currentTrack.subscribe(value => {
					currentTrack = value;
					artists = value.artists.map(a => a.name).join(', ');
				});
			} catch (error) {
				console.error('error getting player', error);
				player = undefined;
			}
		}
	}

	async function setWebsocketConnection(roomId: string | undefined) {
		if (browser && roomId) {
			const res = await fetch('/api/auth');
			const body: AuthTokens = await res.json();

			if (!body.sessionToken) return;

			ws = getWebSocket(roomId, body.sessionToken);
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
		await sendTrackChange(ws, { track, user_id: null });
	}

	function play() {
		player?.togglePlay();
	}

	function next() {
		player?.nextTrack();
	}

	function previous() {
		player?.previousTrack();
	}

	if (unsub) {
		onDestroy(unsub);
	}
</script>

{#if currentTrack?.name}
	<div class="container bg-surface-800 p-2">
		<div class="main-wrapper">
			<p class="pt-2 text-lg font-bold">{currentTrack.name}</p>
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
