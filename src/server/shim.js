/**
 * Copied from MDN to provide ES6 (Harmony) features.
 */

if (!Array.prototype.findIndex) {
    Array.prototype.findIndex = function(predicate) {
        var list,
            length,
            thisArg,
            value,
            i;
        if (this == null) {
            throw new TypeError('Array.prototype.findIndex called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        list = Object(this);
        length = list.length >>> 0;
        thisArg = arguments[1];
        
        for (i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return i;
            }
        }
        return -1;
    };
}

if (![].includes) {
    Array.prototype.includes = function(searchElement /*, fromIndex*/ ) {'use strict';
        var n,
            k,
            currentElement,
            O = Object(this),
            len = parseInt(O.length, 10) || 0;
        if (len === 0) {
            return false;
        }
        n = parseInt(arguments[1], 10) || 0;
        if (n >= 0) {
            k = n;
        } else {
            k = len + n;
            if (k < 0) {k = 0;}
        }
        while (k < len) {
            currentElement = O[k];
            if (searchElement === currentElement ||
                (searchElement !== searchElement && currentElement !== currentElement)) {
                return true;
            }
            k++;
        }
        return false;
    };
}

if (!String.prototype.endsWith) {
    String.prototype.endsWith = function(searchString, position) {
        var subjectString = this.toString(),
            lastIndex;
        if (position === undefined || position > subjectString.length) {
            position = subjectString.length;
        }
        position -= searchString.length;
        lastIndex = subjectString.indexOf(searchString, position);
        return lastIndex !== -1 && lastIndex === position;
    };
}