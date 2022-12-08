<script lang="ts">
    import { Task } from "../types";
    import { hideTask, tasks } from "./stores";
    import { TimeasrStore } from "../logic/timeasr-store";
    import { toHoursAndMinutes } from "../logic/time-formatters";
    import AddTask from "./add-task.svelte";
    import EyeCrossedSvg from "./svg/eye-crossed-svg.svelte";

    const classNames = (task: Task) => {
        const cn = ["MeasureList__Item"];
        if (task.active) {
            cn.push("MeasureList__Item--active");
        }
        return cn.join(" ");
    }
    const onSelectClick = (task: Task) => {
        task.active ? TimeasrStore.closeTimelog() : TimeasrStore.startTimelog(task.name);
    }
    const onHideClick = (task: Task) => {
        hideTask(task)
    }
</script>

<main class="MeasureList">
    {#each $tasks as task}
        <div class={classNames(task)} on:click={() => onSelectClick(task)}>
            {#if !task.active}
                <button class="MeasureList__Item__Close" on:click={(event) => {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    onHideClick(task);
                }}>
                    <EyeCrossedSvg />
                </button>
            {/if}
            <span>{task.name}</span>
            <span>{toHoursAndMinutes(task.loggedTime)}</span>
        </div>
    {/each}
    <AddTask />
</main>
