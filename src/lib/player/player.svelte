<script lang="ts">
	import Icon from '@iconify/svelte';

	export let session: { token: string };

	console.log(session);

	import { browser } from '$app/environment';
	import { buildPlayer, type CurrentTrack, type Player } from './buildPlayer';
	import { onDestroy } from 'svelte';
	import type { Unsubscriber } from 'svelte/store';

	let player: Player;
	let track: string;
	let artists: string;
	let unsub: Unsubscriber | undefined;

	$: currentTrack = track;

	async function setPlayer(session: { token: string }) {
		console.log('existing player', player);

		if (browser && session.token) {
			try {
				const playerRes:
					| { player: Player; currentTrack: CurrentTrack }
					| undefined = await buildPlayer(session.token);

				if (!playerRes || !playerRes?.player) {
					console.error('no player received');
					return;
				}

				player = playerRes.player;

				unsub = playerRes.currentTrack.subscribe(value => {
					track = value.name;
					artists = value.artists.map(a => a.name).join(', ');
				});
			} catch (error) {
				console.error(error);
			}
		}
	}

	$: session.token && setPlayer(session);

	function play() {
		player.togglePlay();
	}

	function next() {
		player.nextTrack();
	}

	function previous() {
		player.previousTrack();
	}

	if (unsub) {
		console.log('unsubbing from player');
		onDestroy(unsub);
	}
</script>

{#if currentTrack}
	<div class="container bg-surface-800 p-2">
		<div class="main-wrapper">
			<p class="pt-2 text-lg font-bold">{currentTrack}</p>
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
