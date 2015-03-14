"use strict";
define(['du','cm'], function (DomUtils, common) {
    var View = function (viewDomElemId, controllerObj, bindingFunction) {
        this.name = viewDomElemId;
        this.viewDomElem = document.getElementById(viewDomElemId);
        this.controller = controllerObj;
        if (typeof bindingFunction === 'function') {
            bindingFunction.call(this, this.viewDomElem);
        }
        this.controller.setView(this);
        return this;
    };
    View.prototype.show = function () {
        this.viewDomElem.style.display = 'block';
        common.eventBus.publish('change:visibility', {source: this.name, change: false});
    };
    View.prototype.hide = function () {
        this.viewDomElem.style.display = 'none';
        common.eventBus.publish('change:visibility', {source: this.name, change: true});
    };
    View.prototype.getName = function () {
        return this.name;
    };
    return View;
});