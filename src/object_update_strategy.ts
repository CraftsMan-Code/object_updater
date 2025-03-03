/*!
 * Copyright © 2024 Object Updater
 */

import { isObject } from "./helpers/helpers";
import { ComplexRules, PrimitiveRule, UpdateAction, UpdateStrategy } from "./interfaces";
import { Updater } from "./updater";



/**
* This class provides an 'update method for updating nested objects.
* This class implements the "UpdateStrategy interface.
*/
export class ObjectUpdateStrategy implements UpdateStrategy {

    private _updater: Updater;

    constructor(updater: Updater) {
        this._updater = updater;
    }

    /**
     * Updates the object property of `original` based on `rulesForKey`
     * 
     * If 'updateValue is not 'undefined' and there is 'action' for whole nested object, one of the following actions occurs:
     * - UpdateAction.DELETE: deletes the nested object under "updatekey from original.
     * - UpdateAction.IGNORE: ignores updateValue and makes no changes.
     * - UpdateAction.REPLACE" and default: replaces the value of the 'updatekey" property in 'original with updateValue.
     * If there is no action in rulesForKey :
     * the method recursively calls the updater's updateObject method with nested object as a parameter to perform the update.
     * 
     * @param original - The original object that will be updated.
     * @param updateValue - The new value to update with.
     * @param updateKey - The key of the original property to be updated.
     * @param rulesForKey - The rules for particular property in original object.
     */
    public update<T>(original: T,
        updateValue: T[keyof T],
        updateKey: keyof T,
        rulesForKey: PrimitiveRule | ComplexRules<T>): void {
        if ('action' in rulesForKey && !isObject(rulesForKey.action)) {
            switch (rulesForKey.action) {
                case UpdateAction.DELETE:
                    delete original[updateKey];
                    return;
                case UpdateAction.IGNORE:
                    return;
                case UpdateAction.UPSERT_BY_KEY:
                    throw new Error(`Cannot perform update on '${String(updateKey)}', 
                    the 'UPSERT_BY_KEY' is available only for array of objects`);
                case UpdateAction.REPLACE:
                default:
                    original[updateKey] = updateValue;
            }

        } else if (isObject(rulesForKey)) {
            original[updateKey] =
                this._updater.updateObject<T[keyof T]>(
                    original[updateKey],
                    updateValue,
                    rulesForKey as ComplexRules<T[keyof T]>
                );
        }
    }

}