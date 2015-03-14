"use strict";
define(function () {
    var Controller = function (modelHandler) {
        this.modelHandler = modelHandler;
        return this;
    };
    Controller.prototype.setView = function (viewObj) {
        this.view = viewObj;
    };
    Controller.prototype.updateView = function (model) {
        this.view.update(model);
    };
    return Controller;
});