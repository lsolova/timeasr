import { addTaskHideChangeEventListener, isTaskHidden } from "./task-hiding";
import { addTimeasrTickListener } from "../logic/view-tick";
import { CurrentTime } from "../logic/current-time";
import { dayEnd, dayStart } from "../logic/time-conversions";
import { DexieBinding } from "../logic/persistent-store/timeasr-store-dexie-binding";
import { parseTimelogsToStat, parseTimelogsToTasks } from "../logic/model-parsers";
import { readable, writable } from "svelte/store";
import { Stat, Task } from "../types";
import { TimeasrStore } from "../logic/timeasr-store";

const getCurrentInfo = () => {
    return {
        currentInfo: {
            time: CurrentTime.get(),
            dayStart: dayStart(CurrentTime.get()),
            edited: CurrentTime.isDifferent(),
        },
    };
};

export const init = async () => {
    await TimeasrStore.initialize(DexieBinding);
};
export const tasks = writable<Task[]>([], (set: (tasks: Task[]) => void) => {
    const updateTasks = () => {
        const currentEpoch = CurrentTime.get();
        const todayStart = dayStart(currentEpoch);
        const todayEnd = dayEnd(currentEpoch);
        const timelogs = TimeasrStore.getTimelogsOfPeriod(todayStart - 10 * 86400000, todayEnd);
        const tasks = parseTimelogsToTasks(timelogs, currentEpoch);
        set(tasks.filter((task) => !isTaskHidden(task.name)));
    };
    TimeasrStore.watch(updateTasks);
    addTimeasrTickListener(updateTasks);
    addTaskHideChangeEventListener(updateTasks);
});
export const stats = readable(
    {
        ...parseTimelogsToStat([], CurrentTime.get()),
        ...getCurrentInfo(),
    },
    (set: (stat: Stat) => void) => {
        const updateStats = () => {
            const currentEpoch = CurrentTime.get();
            const allTimelogs = TimeasrStore.getTimelogsOfPeriod(0);
            set({
                ...parseTimelogsToStat(allTimelogs, currentEpoch),
                ...getCurrentInfo(),
            });
        };
        CurrentTime.addEventListener(updateStats);
        TimeasrStore.watch(updateStats);
        addTimeasrTickListener(updateStats);
    }
);
