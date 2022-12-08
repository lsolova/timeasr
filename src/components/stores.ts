import { now } from "../logic/browser-wrapper";
import { parseTimelogsToStat, parseTimelogsToTasks } from "../logic/model-parsers";
import { readable, writable } from "svelte/store";
import { Stat, Task } from "../types";
import { TimeasrStore } from "../logic/timeasr-store";
import { dayEnd, dayStart } from "../logic/time-conversions";

const hiddenTasks = new Set<string>();

export const init = async () => {
    await TimeasrStore.initialize();
};
export const tasks = writable<Task[]>([], (set: (tasks: Task[]) => void) => {
    TimeasrStore.watch(() => {
        const currentEpoch = now();
        const todayStart = dayStart(currentEpoch);
        const todayEnd = dayEnd(currentEpoch);
        const timelogs = TimeasrStore.getTimelogsOfPeriod(todayStart - 10 * 86400000, todayEnd);
        const tasks = parseTimelogsToTasks(timelogs, currentEpoch);
        set(tasks.filter((task) => !hiddenTasks.has(task.name)));
    });
});
export const stats = readable(parseTimelogsToStat([], [], now()), (set: (stat: Stat) => void) => {
    TimeasrStore.watch(() => {
        const currentEpoch = now();
        const allTimelogs = TimeasrStore.getTimelogsOfPeriod(0);
        const dayTimelogs = TimeasrStore.getTimelogsOfPeriod(dayStart(currentEpoch), dayEnd(currentEpoch));
        set(parseTimelogsToStat(allTimelogs, dayTimelogs, currentEpoch));
    });
});

export const hideTask = (task: Task) => {
    hiddenTasks.add(task.name);
    tasks.update((originalTasks) => originalTasks.filter((task) => !hiddenTasks.has(task.name)));
};
