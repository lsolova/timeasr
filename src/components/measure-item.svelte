<script lang="ts">
    import { Task } from "../types";
    import { toHoursAndMinutes } from "../logic/time-formatters";
    import ActionButton from "./action-button.svelte";
    import EyeCrossedSvg from "./svg/eye-crossed-svg.svelte";
    import InProgressTimerSvg from "./svg/in-progress-timer-svg.svelte";

    export let onHideClick: (task: Task) => void;
    export let onSelectClick: (task: Task) => void;
    export let task: Task;

    let classNames = (task: Task) => {
        const cn = ["MeasureList__Item"];
        if (task.active) {
            cn.push("MeasureList__Item--active");
        }
        return cn.join(" ");
    };
</script>

<div
    class={classNames(task)}
    on:click={() => onSelectClick(task)}
    on:keydown={(event) => {
        if (event.code === "KeyS") {
            onSelectClick(task);
        }
    }}
>
    {#if task.active}
        <InProgressTimerSvg />
    {/if}
    <div>
        <span>{task.name}</span>
        <span>{toHoursAndMinutes(task.loggedTime)}</span>
    </div>
    {#if !task.active}
        <ActionButton
            className="MeasureList__Item__Hide"
            onClick={() => onHideClick(task)}
            ariaDetails="Hide this item temporary"
        >
            <EyeCrossedSvg slot="icon" />
            <p slot="tooltip">Hide from view temporary</p>
        </ActionButton>
    {/if}
</div>
