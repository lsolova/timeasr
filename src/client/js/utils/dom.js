'use strict';

module.exports = {
    clearAndFill: function clearAndFill(content) {
        while (this.hasChildNodes()) {
            this.removeChild(this.firstChild);
        }
        this.appendChild(document.createTextNode(content));
    },
    removeClasses: function removeClasses(classes) {
        var i = 0;
        for (; i < classes.length; i++) {
            this.classList.remove(classes[i]);
        }
    }
}