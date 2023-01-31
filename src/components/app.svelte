<script lang="ts">
    import { initializeTimeasrTick } from "../logic/view-tick";
    import { init } from "./stores";
    import MeasureList from "./measure-list.svelte";
    import Stats from "./stats.svelte";
    
    let loading = true;

    // EXPERIMENTAL CODE FRAGMENT -->
    // eslint-disable-next-line no-console
    window.addEventListener("timelog:entry", (e) => console.log("TLE", e));
    // <-- EXPERIMENTAL CODE FRAGMENT
    initializeTimeasrTick();
    init().then(() => {
        loading = false;
    });
</script>

<div class="App">
    {#if loading}
        <div class="App__Loading">
            Loading
        </div>
    {:else}
        <MeasureList />
        <Stats />
    {/if}
</div>
