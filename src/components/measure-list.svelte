<script lang="ts">
    import { Task } from "../types";
    import { tasks } from "./stores";
    import { TimeasrStore } from "../logic/timeasr-store";
    import { toHoursAndMinutes } from "../logic/time-formatters";
    import AddTask from "./add-task.svelte";
    import SolovaLogoSvg from "./svg/solova-logo-svg.svelte";

    const classNames = (task: Task) => {
        const cn = ["MeasureList__Item"];
        if (task.active) {
            cn.push("MeasureList__Item--active");
        }
        return cn.join(" ");
    }
    const onClick = (task: Task) => {
        task.active ? TimeasrStore.closeTimelog() : TimeasrStore.startTimelog(task.name);
    }
</script>

<main class="MeasureList">
    {#each $tasks as task}
        <div class={classNames(task)} on:click={() => onClick(task)} data-task-id={task.name}>
            <span>{task.name}</span>
            <span>{toHoursAndMinutes(task.loggedTime)}</span>
        </div>
    {/each}
    <AddTask />
    <div class="Copyright">
        <SolovaLogoSvg />
    </div>
</main>
