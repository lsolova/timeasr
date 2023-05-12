<script lang="ts">
    import { Task } from "../types";
    import { toHoursAndMinutes } from "../logic/time-formatters";
    import EyeCrossedSvg from "./svg/eye-crossed-svg.svelte";
    import InProgressTimerSvg from "./svg/in-progress-timer-svg.svelte";
    import Tooltip from "./tooltip.svelte";

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
        <button
            class="MeasureList__Item__Close"
            title="Hide this item until page reload"
            on:click={(event) => {
                event.preventDefault();
                event.stopImmediatePropagation();
                onHideClick(task);
            }}
        >
            <Tooltip stopPropagation={false}>
                <EyeCrossedSvg slot="trigger" />
                <p slot="tooltip">Hide from view temprary</p>
            </Tooltip>
        </button>
    {/if}
</div>
