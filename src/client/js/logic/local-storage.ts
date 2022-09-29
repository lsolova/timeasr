export function get(key: string): any {
    return JSON.parse(window.localStorage.getItem(key));
}
export function remove(key: string): void {
    window.localStorage.removeItem(key);
}
export function set(key: string, value: any): void {
    window.localStorage.setItem(key, JSON.stringify(value));
}
export function getOrSet(key: string, defaultValue: any): any {
    let result = get(key);
    if (!result || result === null) {
        set(key, defaultValue);
        result = defaultValue;
    }
    return result;
}
