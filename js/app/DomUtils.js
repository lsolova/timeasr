"use strict";
define(function(){
    return {
        clearAndFill: function (element, content) {
            while (element.hasChildNodes()) {
                element.removeChild(element.firstChild);
            }
            element.appendChild(document.createTextNode(content));
        },
        removeClasses: function (element, classes) {
            var i = 0;
            for (; i < classes.length; i++) {
                element.classList.remove(classes[i]);
            }
        }
    };
});