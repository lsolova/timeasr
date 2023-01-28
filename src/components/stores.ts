import { now } from "../logic/browser-wrapper";
import { parseTimelogsToStat, parseTimelogsToTasks } from "../logic/model-parsers";
import { readable, writable } from "svelte/store";
import { Stat, Task } from "../types";
import { TimeasrStore } from "../logic/timeasr-store";
import { dayEnd, dayStart } from "../logic/time-conversions";
import { addTimeasrTickListener } from "../logic/view-tick";

const hiddenTasks = new Set<string>();

export const init = async () => {
    await TimeasrStore.initialize();
};
export const tasks = writable<Task[]>([], (set: (tasks: Task[]) => void) => {
    const updateTasks = () => {
        const currentEpoch = now();
        const todayStart = dayStart(currentEpoch);
        const todayEnd = dayEnd(currentEpoch);
        const timelogs = TimeasrStore.getTimelogsOfPeriod(todayStart - 10 * 86400000, todayEnd);
        const tasks = parseTimelogsToTasks(timelogs, currentEpoch);
        set(tasks.filter((task) => !hiddenTasks.has(task.name)));
    }
    TimeasrStore.watch(updateTasks);
    addTimeasrTickListener(updateTasks);
});
export const stats = readable(parseTimelogsToStat([], now()), (set: (stat: Stat) => void) => {
    const updateStats = () => {
        const currentEpoch = now();
        const allTimelogs = TimeasrStore.getTimelogsOfPeriod(0);
        set(parseTimelogsToStat(allTimelogs, currentEpoch));
    }
    TimeasrStore.watch(updateStats);
    addTimeasrTickListener(updateStats);
});

export const hideTask = (task: Task) => {
    hiddenTasks.add(task.name);
    tasks.update((originalTasks) => originalTasks.filter((task) => !hiddenTasks.has(task.name)));
};
