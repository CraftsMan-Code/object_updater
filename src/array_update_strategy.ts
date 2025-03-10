/*!
 * Copyright © 2024 Object Updater
 */

import { forEachKey } from "./helpers/helpers";
import { ComplexRules, PrimitiveRule, UpdateAction, UpdateStrategy } from "./interfaces"

/**
 * This class provides an update method for updating array data types.
 * This class implements the UpdateStrategy interface.
 */
export class ArrayUpdateStrategy implements UpdateStrategy {
    public update<T>(original: T,
        updateValue: T[keyof T],
        updateKey: keyof T,
        rulesForKey: ComplexRules<T> | PrimitiveRule
    ): void {
        if ('action' in rulesForKey) {
            switch (rulesForKey.action) {
                case UpdateAction.DELETE:
                    delete original[updateKey];
                    return;
                case UpdateAction.IGNORE:
                    return;
                case UpdateAction.MERGE:
                    this.merge(original, updateKey, updateValue);
                    return;
                case UpdateAction.UNION:
                    this.union(original, updateKey, updateValue);
                    return;
                case UpdateAction.UPSERT_BY_KEY:
                    this.upsertByKey(original, updateKey, updateValue, rulesForKey.mergeKey);
                    return;
                case UpdateAction.REPLACE:
                default:
                    original[updateKey] = updateValue;
            }
        } else {
            original[updateKey] = updateValue;
        }
    }


    /**
     * Merges the original array with the update array,
     * no check for duplicates
     * @param original 
     * @param updateKey
     * @param updateValue
     * @returns
     * @throws Error if the original array and update array are not of the same data type
     * @throws Error if the data type is not supported
     * @throws Error if the attribute array must hold only one data type
     */
    private merge<T>(original: T, updateKey: keyof T, updateValue: T[keyof T]): void {
        const originalValue: T[keyof T] = original[updateKey];

        if (Array.isArray(originalValue) && Array.isArray(updateValue)) {
            originalValue.push(...updateValue);
        } else {
            // This should never happens since original[updateKey] will be always array
            throw new Error(`Expected an array for key '${String(updateKey)}'`);
        }
    }

    /**
     * Unions the original array with the update array,
     * no duplicates.
     * @param original
     * @param updateKey
     * @param updateValue
     * @returns
     * @throws Error if the original array and update array are not of the same data type
     * @throws Error if the data type is not supported
     * @throws Error if the attribute array must hold only one data type
     */ 
    private union<T>(original: T, updateKey: keyof T, updateValue: T[keyof T]): void {
        const originalValue: T[keyof T] = original[updateKey];
    
        if (!Array.isArray(originalValue) || !Array.isArray(updateValue)) {
            // This should never happens since original[updateKey] will be always array
            throw new Error(`Expected an array for key '${String(updateKey)}'`);
        }
    
        original[updateKey] = this.isObjectType(originalValue, updateKey, updateValue)
            ? this.mergeArrayOfObjectsNoDuplicates(originalValue, updateValue) as T[keyof T]
            : [...new Set([...originalValue, ...updateValue])] as T[keyof T];
    }

    /**
     * Updates the original array with the update array,
     * no check for duplicates.
     * @param original
     * @param updateKey
     * @param updateValue           
     * @param mergeKey
     * @returns
     * @throws Error if the original array and update array are not of the same data type
     * @throws Error if the data type is not supported
     * @throws Error if the attribute array must hold only one data type
     * @throws Error if the 'UPSERT_BY_KEY' is available only for array of objects
     * @throws Error if the 'UPSERT_BY_KEY' requires mergeKey to be defined
     */
    private upsertByKey<T>(original: T, updateKey: keyof T, updateValue: T[keyof T], mergeKey?: string): void {
        const originalValue: T[keyof T] = original[updateKey];
        if (!Array.isArray(originalValue) || !Array.isArray(updateValue)) {
            // This should never happens since original[updateKey] will be always array
            throw new Error(`Expected an array for key '${String(updateKey)}'`);
        }

        if (this.isObjectType(originalValue, updateKey, updateValue)) {

            if (mergeKey) {
                const tmpMap = new Map()
                originalValue.forEach((originalObject) => {
                    tmpMap.set(originalObject[mergeKey], originalObject)
                })

                updateValue.forEach((updateObject) => {
                    if (!tmpMap.has(updateObject[mergeKey])) {
                        tmpMap.set(updateObject[mergeKey], updateObject)
                    } else {
                        const ojectToBeUpdated = tmpMap.get(updateObject[mergeKey])
                    
                        forEachKey(updateObject, (key: string | number | symbol) => {
                            ojectToBeUpdated[key] = updateObject[key]
                        })   
                    }
                })
                original[updateKey] = [...tmpMap.values()] as T[keyof T];
                
            } else {
                throw new Error(
                    `Cannot perform update on '${String(updateKey)}', ` + 
                    'the UPSERT_BY_KEY requires mergeKey to be defined',
                );
            }
        } else {
            throw new Error(
                `Cannot perform update on '${String(updateKey)}', ` +
                "the 'UPSERT_BY_KEY' is available only for array of objects",
            );
        }
    }


    /**
     * Checks if the data type of the array is an object
     * @param originalValue
     * @param updateKey
     * @param updateValue       
     * @returns
     * @throws Error if the attribute array must hold only one data type
     * @throws Error if the data type is not supported
     */
    private isObjectType<T>(originalValue: T[], updateKey: keyof T, updateValue: T[]): boolean {
        const originTypes: Set<string> = new Set(this.getArrayDataTypes(originalValue));
        const updateTypes: Set<string> = new Set(this.getArrayDataTypes(updateValue));

        if (originTypes.size > 1 || updateTypes.size > 1) {
            throw new Error(`The attribute array '${String(updateKey)}' must hold only one data type`);
        }

        const [type] = updateTypes; // Extracts the single type (since we ensured only one exists)

        if (type === "object") return true;
        if (["string", "number", "boolean"].includes(type)) return false;

        throw new Error(`Not supported datatype: '${type}' for attribute: '${String(updateKey)}'`);
    }

    /**
     * Returns the datatypes that are included in array
     * @param arr
     * @returns array of data types
     */
    private getArrayDataTypes<T>(arr: T[]): string[] {
        return Array.from(new Set(arr.map(item => typeof item)));
    }

    /**
     * Merges two arrays of objects without duplicates.
     * @param arr1
     * @param arr2
     * @returns
     */
    private mergeArrayOfObjectsNoDuplicates<T extends Record<string, unknown>>(arr1: T[], arr2: T[]): T[] {
        const set = new Set<string>(arr1.map(obj => this.normalizeObject(obj)));
    
        for (const obj of arr2) {
            set.add(this.normalizeObject(obj)); // Add normalized object
        }
    
        return Array.from(set).map(str => JSON.parse(str)); // Convert back to array of objects
    }
    
    /**
     * Turns object into the normalized string
     * @param obj to be normalized
     * @returns normalized string
     */
    private normalizeObject<T extends Record<string, unknown>>(obj: T): string {
        return JSON.stringify(
            Object.keys(obj).sort().reduce((acc, key) => {
                return { ...acc, [key]: obj[key as keyof T] };
            }, {} as Record<keyof T, T[keyof T]>)
        );
    }
}