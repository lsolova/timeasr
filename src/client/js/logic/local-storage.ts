export function get(key: string): unknown {
    const content = window.localStorage.getItem(key);
    return content ? JSON.parse(content) : null;
}
export function remove(key: string): void {
    window.localStorage.removeItem(key);
}
export function set(key: string, value: unknown): void {
    window.localStorage.setItem(key, JSON.stringify(value));
}
export function getOrSet(key: string, defaultValue: unknown): unknown {
    let result = get(key);
    if (!result || result === null) {
        set(key, defaultValue);
        result = defaultValue;
    }
    return result;
}
