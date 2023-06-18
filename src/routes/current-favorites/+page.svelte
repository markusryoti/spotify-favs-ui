<script lang="ts">
    import type { PageData } from "./$types";

    export let data: PageData;
</script>

<h1>current items</h1>

<ul class="list">
    {#each data.tracks as track}
        <li>
            <div class="">
                <span class="">
                    <img
                        src={track.album.images[0].url}
                        alt=""
                        class="w-16 rounded-full"
                    />
                </span>
            </div>
            <div class="flex flex-col">
                <h4 class="font-semibold">{track.name}</h4>
                <p>{track.album.artists.map((a) => a.name).join(", ")}</p>
            </div>
        </li>
    {/each}
</ul>
