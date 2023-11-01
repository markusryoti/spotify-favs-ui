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
	import type { PlayerStatus } from '$lib/player/buildPlayer';
	import type { AuthTokens } from './api/auth/+server';

	export let data: LayoutData;

	let currentTile = 0;
	let currentRoom: undefined | string;
	let authTokens: AuthTokens;

	$: currentTile = currentTile;
	$: currentRoom = currentRoom;

	$: $page && setActiveTab();
	$: $page && setRoom();

	const playerStatus = writable<PlayerStatus>({
		track: {
			id: '',
			uri: '',
			name: '',
			artists: [{ name: '' }],
			album: { images: [] },
		},
		playing: false,
	});

	const tokens = writable<AuthTokens>({
		accessToken: data.accessToken,
		sessionToken: data.sessionToken,
	});

	setContext('playerStatus', playerStatus);
	setContext('authTokens', tokens);

	tokens.subscribe(ts => {
		authTokens = ts;
	});

	$: authenticated = authTokens.accessToken && authTokens.sessionToken;

	function setActiveTab() {
		const path = $page.url.pathname;
		const formatted = path.split('/')[1];

		switch (formatted) {
			case '':
				currentTile = 0;
				break;
			case 'current-favorites':
				currentTile = 1;
				break;
			case 'rooms':
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

<div class="h-full overflow-hidden bg-surface-800">
	<AppShell>
		<svelte:fragment slot="header">
			<AppBar regionRowMain="text-xl font-bold" background="bg-surface-900"
				>favs</AppBar
			>
		</svelte:fragment>

		<svelte:fragment slot="sidebarLeft">
			{#if authenticated}
				<AppRail background="bg-surface-700">
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

		<div class="p-6">
			<slot />
		</div>

		<svelte:fragment slot="footer">
			{#if authenticated}
				<Player {playerStatus} />
			{/if}
		</svelte:fragment>
	</AppShell>
</div>

<style>
</style>
