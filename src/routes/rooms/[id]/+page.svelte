<script lang="ts">
	import { getContext } from 'svelte';
	import type { PageData } from './$types';
	import type { CurrentTrack } from '$lib/player/buildPlayer';
	import type { Writable } from 'svelte/store';

	export let data: PageData;

	const currentTrack = getContext<Writable<CurrentTrack>>('currentTrack');

	currentTrack.subscribe(curr => {
		console.log('current in room', curr);
	});
</script>

<h1>{data.room.name}</h1>
