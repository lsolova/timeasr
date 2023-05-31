<script lang="ts">
    import { hasHiddenTasks, resetHide } from "../task-hiding";
    import { tasks } from "../stores";
    import ActionButton from "../action-button.svelte";
    import EyeSvg from "./eye-svg.svelte";

    let showResetHideButton = false;

    tasks.subscribe(() => {
        showResetHideButton = hasHiddenTasks();
    });
</script>

{#if showResetHideButton}
    <ActionButton className="Stats__Actions__Icon" onClick={() => resetHide()}>
        <EyeSvg slot="icon" />
        <p slot="tooltip">Show all hidden tasks</p>
    </ActionButton>
{/if}
