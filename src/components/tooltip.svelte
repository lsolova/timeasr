<script lang="ts">
    import { randomUUID } from "../logic/browser-wrapper";
    import { tooltip } from "./tooltip-action";

    export let stopPropagation = true;

    const tooltipContentId = `tooltip-content-${randomUUID()}`;
</script>

<div class="Tooltip">
    <div
        class="Tooltip__Trigger"
        use:tooltip={{ contentId: tooltipContentId, stopPropagation, visibilityClass: "Tooltip__Content--visible" }}
    >
        <slot name="trigger" />
    </div>
    <div class="Tooltip__Content" id={tooltipContentId}>
        <div data-popper-arrow class="Tooltip__Arrow" />
        <slot name="tooltip" />
    </div>
</div>
