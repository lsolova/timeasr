import { now } from "../logic/browser-wrapper";
import { parseTimelogsToStat, parseTimelogsToTasks } from "../logic/model-parsers";
import { readable } from "svelte/store";
import { Stat, Task } from "../types";
import { TimeasrStore } from "../logic/timeasr-store";
import { dayEnd, dayStart } from "../logic/time-conversions";

export const init = async () => {
    await TimeasrStore.initialize();
};
export const tasks = readable<Task[]>([], (set: (tasks: Task[]) => void) => {
    TimeasrStore.watch(() => {
        const currentEpoch = now();
        const todayStart = dayStart(currentEpoch);
        const todayEnd = dayEnd(currentEpoch);
        const timelogs = TimeasrStore.getTimelogsOfPeriod(todayStart - 10 * 86400000, todayEnd);
        set(parseTimelogsToTasks(timelogs, currentEpoch));
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
