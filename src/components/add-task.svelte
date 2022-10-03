<script lang="ts">
    import { TimeasrStore } from "../logic/timeasr-store";

    const onKeyUp = async (event: KeyboardEvent) => {
        if (event.key === "Enter") {
            const eventTarget = (event.currentTarget as HTMLInputElement);
            const newTaskName = eventTarget.value;
            await TimeasrStore.startTimelog(newTaskName);
            eventTarget.value = "";
        }
    }
</script>

<div class="MeasureList__Item">
    <input id="NewTaskInput" placeholder="Task name" type="text" on:keyup={onKeyUp}/>
</div>
