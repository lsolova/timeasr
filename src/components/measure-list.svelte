<script lang="ts">
    import { hideTask } from "./task-hiding";
    import { Task } from "../types";
    import { tasks } from "./stores";
    import { TimeasrStore } from "../logic/timeasr-store";
    import { wrapInCatch } from "../logic/error-notification";
    import AddTask from "./add-task.svelte";
    import MeasureItem from "./measure-item.svelte";

    const onSelectClick = (task: Task) => {
        wrapInCatch(() => (task.active ? TimeasrStore.closeTimelog() : TimeasrStore.startTimelog(task.name)));
    };
    const onHideClick = (task: Task) => {
        hideTask(task.name);
    };
</script>

<main class="MeasureList">
    {#each $tasks as task}
        <MeasureItem {onHideClick} {onSelectClick} {task} />
    {/each}
    <AddTask />
</main>
