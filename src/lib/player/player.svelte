<script lang="ts">
	export let playerStatus: Writable<PlayerStatus>;

	import Icon from '@iconify/svelte';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { buildPlayer, type Player, type PlayerStatus } from './buildPlayer';
	import type { Writable } from 'svelte/store';
	import { getArtistName } from '$lib/spotify';

	let player: Player | undefined;
	let currentlyPlaying: PlayerStatus | undefined;
	let artists: string | undefined;

	const unsub = playerStatus.subscribe(curr => {
		currentlyPlaying = curr;
	});

	$: currentlyPlaying = currentlyPlaying;
	$: artists = getArtistName(currentlyPlaying?.track);

	$: setPlayer($page.data.accessToken);

	async function setPlayer(token: string) {
		if (player) return;

		if (browser && token) {
			try {
				console.log('getting new player');
				const p = await buildPlayer(token, playerStatus);

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

	function play() {
		player?.togglePlay();
	}

	function next() {
		player?.nextTrack();
	}

	function previous() {
		player?.previousTrack();
	}
</script>

{#if currentlyPlaying?.track.name && player}
	<div class="bg-surface-900 p-2">
		<div class="main-wrapper">
			<p class="pt-2 text-lg font-bold">{currentlyPlaying.track.name}</p>
			<p class="pb-1">{artists}</p>
			<div>
				<button on:click={previous}>
					<Icon icon="mdi-light:arrow-left" height="24" />
				</button>
				{#if currentlyPlaying.playing}
					<button on:click={play}>
						<Icon icon="mdi-light:pause" height="26" />
					</button>
				{:else}
					<button on:click={play}>
						<Icon icon="mdi-light:play" height="26" />
					</button>
				{/if}

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
