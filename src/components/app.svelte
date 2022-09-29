<script lang="ts">
    import { init } from "./stores";
    import MeasureList from "./measure-list.svelte";
    import Stats from "./stats.svelte";
    
    let loading = true;

    // EXPERIMENTAL CODE FRAGMENT -->
    window.addEventListener("timelog:entry", (e) => console.log("TLE", e));
    // <-- EXPERIMENTAL CODE FRAGMENT
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
        