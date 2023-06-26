<script>
    import "../app.postcss";

    // Your selected Skeleton theme:
    import "@skeletonlabs/skeleton/themes/theme-skeleton.css";

    // This contains the bulk of Skeletons required styles:
    import "@skeletonlabs/skeleton/styles/all.css";

    // Finally, your application's global stylesheet (sometimes labeled 'app.css')
    import "../app.postcss";

    import {
        AppShell,
        AppBar,
        AppRail,
        AppRailTile,
        AppRailAnchor,
    } from "@skeletonlabs/skeleton";

    let currentTile = 0;
</script>

<AppShell>
    <svelte:fragment slot="header">
        <AppBar>Title</AppBar>
    </svelte:fragment>

    <svelte:fragment slot="sidebarLeft">
        <AppRail>
            <svelte:fragment slot="lead">
                <AppRailAnchor href="/">Home</AppRailAnchor>
            </svelte:fragment>

            <AppRailTile
                bind:group={currentTile}
                name="tile-1"
                value={0}
                title="tile-1"
            >
                <svelte:fragment slot="lead">
                    <AppRailAnchor href="/current-favorites"
                        >Stats</AppRailAnchor
                    >
                </svelte:fragment>
            </AppRailTile>

            <AppRailTile
                bind:group={currentTile}
                name="tile-2"
                value={1}
                title="tile-2"
            >
                <svelte:fragment slot="lead">
                    <AppRailAnchor href="/rooms">Rooms</AppRailAnchor>
                </svelte:fragment>
            </AppRailTile>

            <svelte:fragment slot="trail">
                <AppRailAnchor href="/profile" title="Account"
                    >Profile</AppRailAnchor
                >
            </svelte:fragment>
        </AppRail>
    </svelte:fragment>

    <div class="content">
        <slot />
    </div>

    <svelte:fragment slot="pageFooter">Page Footer</svelte:fragment>
</AppShell>

<style>
    .content {
        padding: 2rem;
    }
</style>
