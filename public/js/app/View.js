"use strict";
define(['cm'], function (common) {
    var View = function (viewDomElemId, controllerObj, bindingFunction) {
        this.viewDomElem = document.getElementById(viewDomElemId);
        this.controller = controllerObj;
        if (typeof bindingFunction === 'function') {
            bindingFunction.call(this, self.viewDomElem);
        }
        this.controller.setView(this);
        return this;
    };
    View.prototype.show = function () {
        this.viewDomElem.style.display = 'block';
        common.eventBus.publish('change:visibility', {source: self.name, change: false});
    };
    View.prototype.hide = function () {
        this.viewDomElem.style.display = 'none';
        common.eventBus.publish('change:visibility', {source: self.name, change: true});
    };
    return View;
});