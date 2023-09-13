<script lang="ts">
	import { getContext } from 'svelte';
	import type { PageData } from './$types';
	import type { Writable } from 'svelte/store';

	export let data: PageData;

	let user: Writable<{ name: string }> = getContext('user');
</script>

<h1>Rooms</h1>

<form method="POST">
	<label class="label">
		<span> Name </span>
		<input type="text" class="input" name="name" />
	</label>
	<button class="btn variant-filled">Add</button>
</form>

<nav class="list-nav">
	<ul>
		{#each data.rooms as room}
			<li>
				<a href={`/rooms/${room.id}`}>
					<span class="badge bg-primary-500">💀</span>
					<span class="flex-auto">{room.name}</span>
				</a>
			</li>
		{/each}
	</ul>
</nav>
