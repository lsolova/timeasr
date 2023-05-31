type TaskHideChangeEventListener = () => void;

const eventListeners = new Set<TaskHideChangeEventListener>();
const hiddenTasks = new Set<string>();

// Listener management
const notify = () => {
    eventListeners.forEach((listener) => listener());
};
export const addTaskHideChangeEventListener = (listener: TaskHideChangeEventListener) => {
    eventListeners.add(listener);
};
export const removeTaskHideChangeEventListener = (listener: TaskHideChangeEventListener) => {
    eventListeners.delete(listener);
};

// Hide management
export const hasHiddenTasks = () => hiddenTasks.size > 0;
export const hideTask = (task: string) => {
    hiddenTasks.add(task);
    notify();
};
export const isTaskHidden = (task: string): boolean => hiddenTasks.has(task);
export const resetHide = (): void => {
    hiddenTasks.clear();
    notify();
};

