export function clearAndFill(content) {
    if (content !== undefined && content !== null) {
        clear.call(this);
        this.appendChild(document.createTextNode(content));
    }
}

export function clear() {
    while (this.hasChildNodes()) {
        this.removeChild(this.firstChild);
    }
}

export function removeClasses(classes) {
    var i = 0;
    for (; i < classes.length; i++) {
        this.classList.remove(classes[i]);
    }
}
