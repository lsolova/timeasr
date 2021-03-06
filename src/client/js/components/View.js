export default function View(viewDomElemId, controllerObj, bindingFunction) {
    this.name = viewDomElemId;
    this.viewDomElem = document.getElementById(viewDomElemId);
    this.controller = controllerObj;
    if (typeof bindingFunction === 'function') {
        bindingFunction.call(this, this.viewDomElem);
    }
    this.controller.setView(this);
    return this;
}
View.prototype.show = function show() {
    this.viewDomElem.style.display = 'block';
    this.controller.changeVisibility();
}
View.prototype.hide = function hide() {
    this.viewDomElem.style.display = 'none';
    this.controller.changeVisibility(true);
}
View.prototype.getName = function getName() {
    return this.name;
}
