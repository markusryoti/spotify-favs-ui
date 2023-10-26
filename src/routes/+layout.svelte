<script lang="ts">
	import '../app.postcss';

	// Your selected Skeleton theme:
	import '@skeletonlabs/skeleton/themes/theme-skeleton.css';

	// This contains the bulk of Skeletons required styles:
	import '@skeletonlabs/skeleton/styles/all.css';

	// Finally, your application's global stylesheet (sometimes labeled 'app.css')
	import '../app.postcss';

	import {
		AppShell,
		AppBar,
		AppRail,
		AppRailTile,
		AppRailAnchor,
	} from '@skeletonlabs/skeleton';

	import Player from '$lib/player/player.svelte';

	import type { LayoutData } from './$types';
	import Icon from '@iconify/svelte';
	import { page } from '$app/stores';
	import { writable } from 'svelte/store';
	import { setContext } from 'svelte';
	import type { CurrentTrack } from '$lib/spotify';

	export let data: LayoutData;

	let currentTile = 0;
	let currentRoom: undefined | string;

	$: currentTile = currentTile;
	$: currentRoom = currentRoom;

	$: authenticated = data.accessToken !== '' ? true : false;

	$: $page && setActiveTab();
	$: $page && setRoom();

	const currentTrack = writable<CurrentTrack>({
		id: '',
		uri: '',
		name: '',
		artists: [{ name: '' }],
		album: { images: [] },
	});

	setContext('currentTrack', currentTrack);

	function setActiveTab() {
		const path = $page.url.pathname;

		switch (path) {
			case '/':
				currentTile = 0;
				break;
			case '/current-favorites':
				currentTile = 1;
				break;
			case '/rooms':
				currentTile = 2;
				break;
			default:
				currentTile = 0;
		}
	}

	function setRoom() {
		const path = $page.url.pathname;
		const roomMatch = path.match(/(?<=\/rooms\/)[^/]*/);

		if (!roomMatch) return;

		const roomId = roomMatch[0];

		currentRoom = roomId;
	}
</script>

<AppShell>
	<svelte:fragment slot="header">
		<AppBar regionRowMain="text-xl font-bold">favs</AppBar>
	</svelte:fragment>

	<svelte:fragment slot="sidebarLeft">
		{#if authenticated}
			<AppRail>
				<AppRailTile
					bind:group={currentTile}
					name="tile-1"
					value={0}
					title="tile-1"
				>
					<svelte:fragment slot="lead">
						<AppRailAnchor href="/">Home</AppRailAnchor>
					</svelte:fragment>
				</AppRailTile>

				<AppRailTile
					bind:group={currentTile}
					name="tile-1"
					value={1}
					title="tile-1"
				>
					<svelte:fragment slot="lead">
						<AppRailAnchor href="/current-favorites">Stats</AppRailAnchor>
					</svelte:fragment>
				</AppRailTile>

				<AppRailTile
					bind:group={currentTile}
					name="tile-2"
					value={2}
					title="tile-2"
				>
					<svelte:fragment slot="lead">
						<AppRailAnchor href="/rooms">Rooms</AppRailAnchor>
					</svelte:fragment>
				</AppRailTile>

				<svelte:fragment slot="trail">
					<AppRailAnchor href="/profile" title="Account">
						<div class="flex justify-center">
							<Icon icon="mdi:user" height="24" />
						</div>
					</AppRailAnchor>
				</svelte:fragment>
			</AppRail>
		{/if}
	</svelte:fragment>

	<div class="content">
		<slot />
	</div>

	<svelte:fragment slot="pageFooter">
		{#if authenticated}
			<Player {currentTrack} />
		{/if}
	</svelte:fragment>
</AppShell>

<style>
	.content {
		padding: 2rem;
	}
</style>
