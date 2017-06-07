export default function Controller(modelHandler) {
    this.modelHandler = modelHandler;
    this.view;
}
Controller.prototype.setView = function setView(viewObj) {
    this.view = viewObj;
}
Controller.prototype.updateView = function updateView(model) {
    this.view.update(model);
}
