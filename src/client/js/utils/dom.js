export function clearAndFill(content) {
    if (content !== undefined && content !== null) {
        while (this.hasChildNodes()) {
            this.removeChild(this.firstChild);
        }
        this.appendChild(document.createTextNode(content));
    }
}

export function removeClasses(classes) {
    var i = 0;
    for (; i < classes.length; i++) {
        this.classList.remove(classes[i]);
    }
}
