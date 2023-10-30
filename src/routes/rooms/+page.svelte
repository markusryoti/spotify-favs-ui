<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="p-4">
	<h1>Rooms</h1>

	<form method="POST" class="p-2 mt-6 mb-6">
		<label class="label mb-2 mt-2">
			<span class="font-semibold ml-4"> Name </span>
			<input type="text" class="input h-12 p-4" name="name" />
		</label>
		<div class="pt-2 pb-2">
			<button class="btn variant-filled">Add</button>
		</div>
	</form>

	<nav class="list-nav">
		<ul>
			{#each data.rooms as room}
				<li class="h-10">
					<a href={`/rooms/${room.id}`}>
						<span class="badge bg-primary-500">💀</span>
						<span class="flex-auto">{room.name}</span>
					</a>
				</li>
			{/each}
		</ul>
	</nav>
</div>
