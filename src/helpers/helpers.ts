/*!
 * Copyright © 2024 Object Updater
 */

/**
 * Checks if the input value is an object.
 * @param value Input value to check.
 * @returns True if the input value is an object, false otherwise.
 */
export const isObject = (value: unknown): value is Record<string, unknown> => {
    return typeof value === 'object' && value !== null && value.constructor === Object;
}

/**
 * Iterates over the keys of an object. This is needed because object. keys)
 * does not provide the correct types. 
 * @param object An object to iterate over.
 * @param callback A callback that is called with each object key.
 */
export const forEachKey = <T extends object>(
    object: T | undefined,
    callback: (key: keyof T) => void
): void => {
    if (!object) return;
    (Object.keys(object) as Array<keyof T>).forEach(callback);
};


/**
 * Checks if the object is empty.
 * @param object Input value to check.
 * @returns True if the object is empty, false otherwise.
 */
export const isObjectEmpty = (object: Record<string, unknown>) => {
    return Object.keys(object).length === 0;
}