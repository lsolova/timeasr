export function get(key) {
    return window.localStorage.getItem(key);
}
export function remove(key) {
    window.localStorage.removeItem(key);
}
export function set(key, value) {
    window.localStorage.setItem(key, value);
}
export function getOrSet(key, defaultValue) {
    var result = get(key);
    if (!result || result === null) {
        set(key, defaultValue);
        result = defaultValue;
    }
    return result;
}
