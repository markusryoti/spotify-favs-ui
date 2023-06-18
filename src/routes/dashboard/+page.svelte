<script lang="ts">
    import type { PageData } from "./$types";

    export let data: PageData;
</script>

<h1>Dashboard</h1>

<div>{data.message}</div>
