<script lang="ts">
    import Tooltip from "./tooltip.svelte";

    export let ariaDetails = "";
    export let className: string;
    export let onClick: () => void;
</script>

<button
    class={`ActionButton ${className}`}
    aria-details={ariaDetails}
    on:click={(event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        onClick();
    }}
>
    <Tooltip stopPropagation={false}>
        <slot name="icon" slot="trigger" />
        <slot name="tooltip" slot="tooltip" />
    </Tooltip>
</button>
