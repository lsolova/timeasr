<script lang="ts">
    import { hideTask, tasks } from "./stores";
    import { Task } from "../types";
    import { TimeasrStore } from "../logic/timeasr-store";
    import AddTask from "./add-task.svelte";
    import MeasureItem from "./measure-item.svelte";

    const onSelectClick = (task: Task) => {
        task.active ? TimeasrStore.closeTimelog() : TimeasrStore.startTimelog(task.name);
    };
    const onHideClick = (task: Task) => {
        hideTask(task);
    };
</script>

<main class="MeasureList">
    {#each $tasks as task}
        <MeasureItem {onHideClick} {onSelectClick} {task} />
    {/each}
    <AddTask />
</main>
