/*!
 * Copyright © 2024 Object Updater
 */

import { forEachKey } from "./helpers/helpers";
import { ComplexRules, PrimitiveRule, UpdateAction, UpdateStrategy } from "./interfaces"
import { Updater } from "./updater";

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


    private merge<T>(original: T, updateKey: keyof T, updateValue: T[keyof T]): void {
        const originalValue: T[keyof T] = original[updateKey];

        if (Array.isArray(originalValue) && Array.isArray(updateValue)) {
            originalValue.push(...updateValue);
        } else {
            // This should never happens since original[updateKey] will be always array
            throw new Error(`Expected an array for key '${String(updateKey)}'`);
        }
    }

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
    

    // private upsertByKey<T>(
    //     original: T,
    //     updateKey: keyof T,
    //     updateValue: T[keyof T],
    //     mergeKey?: keyof T[keyof T]
    // ): void {
    //     const originalValue = original[updateKey];
    
    //     if (!Array.isArray(originalValue) || !Array.isArray(updateValue)) {
    //         throw new Error(`Expected an array for key '${String(updateKey)}'`);
    //     }
    
    //     if (!this.isObjectType(originalValue, updateKey, updateValue)) {
    //         throw new Error(`Cannot perform update on '${String(updateKey)}', 
    //             the 'UPSERT_BY_KEY' is available only for an array of objects`);
    //     }
    
    //     if (!mergeKey) {
    //         throw new Error(`Cannot perform update on '${String(updateKey)}'. 
    //             The 'UPSERT_BY_KEY' requires 'mergeKey' to be defined`);
    //     }
    
    //     const tmpMap = new Map<unknown, Record<string, unknown>>();
    
    //     // Add original objects to the map using mergeKey
    //     originalValue.forEach((originalObject) => {
    //         if (mergeKey in originalObject) {
    //             tmpMap.set(originalObject[mergeKey], { ...originalObject });
    //         }
    //     });
    
    //     // Merge or insert update objects
    //     updateValue.forEach((updateObject) => {
    //         if (!(mergeKey in updateObject)) return; // Skip objects missing mergeKey
    
    //         const key = updateObject[mergeKey];
    //         if (tmpMap.has(key)) {
    //             const objectToBeUpdated = tmpMap.get(key)!;
    //             forEachKey(updateObject, (key: keyof typeof objectToBeUpdated) => {
    //                 objectToBeUpdated[key] = updateObject[key];
    //             });
    //         } else {
    //             tmpMap.set(key, { ...updateObject });
    //         }
    //     });
    
    //     original[updateKey] = [...tmpMap.values()] as T[keyof T];
    // }
    


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
                throw new Error(`Cannot perform update on '${String(updateKey)}' ` + 
                'the UPSERT_BY_KEY requires mergeKey to be defined');
            }
        } else {
            throw new Error(`Cannot perform update on '${String(updateKey)}', 
            the 'UPSERT_BY_KEY' is available only for array of objects`);
        }
    }


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
     * @returns 
     */
    private getArrayDataTypes<T>(arr: T[]): string[] {
        return Array.from(new Set(arr.map(item => typeof item)));
    }



    private mergeArrayOfObjectsNoDuplicates<T extends Record<string, unknown>>(arr1: T[], arr2: T[]): T[] {
        const set = new Set<string>(arr1.map(obj => this.normalizeObject(obj)));
    
        for (const obj of arr2) {
            set.add(this.normalizeObject(obj)); // Add normalized object
        }
    
        return Array.from(set).map(str => JSON.parse(str) as T); // Convert back to array of objects
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