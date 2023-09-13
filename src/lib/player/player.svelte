<script lang="ts">
	import Icon from '@iconify/svelte';

	export let session: { token: string };

	console.log(session);

	import { browser } from '$app/environment';
	import { buildPlayer } from './buildPlayer';
	import { onDestroy } from 'svelte';

	let player: any;
	let track: string;
	let unsub: any;

	$: currentTrack = track;

	async function getPlayer(session: { token: string }) {
		if (browser) {
			const playerRes: any = await buildPlayer(session.token);

			player = playerRes.player;

			unsub = playerRes.currentTrack.subscribe((value: { name: string }) => {
				console.log('new subbed track change', value);
				track = value.name;
			});
		}
	}

	$: getPlayer(session);

	function play() {
		player.togglePlay();
	}

	function next() {
		player.nextTrack();
	}

	function previous() {
		player.previousTrack();
	}

	if (unsub) onDestroy(unsub);
</script>

<div class="container bg-surface-800 p-2">
	<div class="main-wrapper">
		<p class="p-2">{currentTrack}</p>
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
