import { now } from "../logic/browser-wrapper";
import { parseTimelogsToStat, parseTimelogsToTasks } from "../logic/model-parsers";
import { readable } from "svelte/store";
import { Stat, Task } from "../types";
import { TimeasrStore } from "../logic/timeasr-store";

export const init = async () => {
    await TimeasrStore.initialize();
};
export const tasks = readable<Task[]>([], (set: (tasks: Task[]) => void) => {
    TimeasrStore.watch(() => {
        set(parseTimelogsToTasks(now()));
    });
});
export const stats = readable(parseTimelogsToStat(now()), (set: (stat: Stat) => void) => {
    TimeasrStore.watch(() => {
        set(parseTimelogsToStat(now()));
    });
});
