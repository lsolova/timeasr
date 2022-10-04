describe("Timeasr/measurement functions", () => {
    it("creates new task", () => {
        const customContent = `custom-${Math.floor((Math.random() * 10000))}`;
        browser
            .url("http://localhost:8081")
            .setValue("#NewTaskInput", customContent)
            .sendKeys("#NewTaskInput", [browser.Keys.ENTER])
            .waitForElementPresent(`[data-task-id=${customContent}]`);
        browser.expect.element(`[data-task-id=${customContent}]`).to.be.present;
    });
});
