import * as TaskHiding from "./task-hiding";

describe("Task hiding", () => {
    it("is empty by default", () => {
        expect.assertions(1);
        expect(TaskHiding.hasHiddenTasks()).toStrictEqual(false);
    });
    it("handles task adding", () => {
        expect.assertions(3);
        TaskHiding.hideTask("test-task");
        expect(TaskHiding.hasHiddenTasks()).toStrictEqual(true);
        expect(TaskHiding.isTaskHidden("test-task")).toStrictEqual(true);
        expect(TaskHiding.isTaskHidden("test-task-2")).toStrictEqual(false);
    });
    it("handles task clearing", () => {
        expect.assertions(2);
        TaskHiding.hideTask("test-task");
        TaskHiding.resetHide();
        expect(TaskHiding.hasHiddenTasks()).toStrictEqual(false);
        expect(TaskHiding.isTaskHidden("test-task")).toStrictEqual(false);
    });
    it("notifies listener on task adding", () => {
        expect.assertions(1);
        const taskHideChangeListener = jest.fn();
        TaskHiding.addTaskHideChangeEventListener(taskHideChangeListener);
        TaskHiding.hideTask("test-task");
        expect(taskHideChangeListener).toHaveBeenCalledTimes(1);
    });
    it("notifies listener on hide reset", () => {
        expect.assertions(1);
        const taskHideChangeListener = jest.fn();
        TaskHiding.hideTask("test-task");
        TaskHiding.addTaskHideChangeEventListener(taskHideChangeListener);
        TaskHiding.resetHide();
        expect(taskHideChangeListener).toHaveBeenCalledTimes(1);
    });
    it("removes listener", () => {
        expect.assertions(1);
        const taskHideChangeListener = jest.fn();
        TaskHiding.hideTask("test-task");
        TaskHiding.addTaskHideChangeEventListener(taskHideChangeListener);
        TaskHiding.removeTaskHideChangeEventListener(taskHideChangeListener);
        TaskHiding.resetHide();
        expect(taskHideChangeListener).toHaveBeenCalledTimes(0);
    });
});
