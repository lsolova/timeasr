/* istanbul ignore file */
export const now = (): number => {
    return Date.now();
};
export const randomUUID = (): string => {
    return crypto.randomUUID();
};
