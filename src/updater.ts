/*!
 * Copyright © 2024 Object Updater
 */

import { ArrayUpdateStrategy } from "./array_update_strategy";
import { forEachKey, isObject, isObjectEmpty } from "./helpers/helpers";
import { ComplexRules, PrimitiveRule, UpdateStrategy } from "./interfaces";
import { ObjectUpdateStrategy } from "./object_update_strategy";
import { PrimitiveUpdateStrategy } from "./primitive_update_strategy";


export class Updater {

    /**
     * Initializes update strategies for use in the updateObject method.
     */
    private _strategies: Record<string, UpdateStrategy>;

    constructor() {
        this._strategies = {
            array: new ArrayUpdateStrategy(),
            object: new ObjectUpdateStrategy(this),
            primitive: new PrimitiveUpdateStrategy(),
        }
    }


    /**
     * Updates the original object with the provided updates.
     * 
     * @param original The original object that will be updated.
     * @param update Data that is being merged with the original.
     * @param rules Rules for merging Update to the Original object.
     * @returns The updated object.
     */
    public updateObject<T>(original: T, update: Partial<T>, rules?: ComplexRules<T>): T {
        forEachKey(update, (updateKey: keyof T) => {
            // updateValue can't be undefined, loop iterates through update with its keys
            const updateValue: T[keyof T] = update[updateKey] as T[keyof T];
            const originalValue: T[keyof T] = original[updateKey];

            // replace each property if there is no rules provided or its empty
            if (!rules || isObjectEmpty(rules) || !(updateKey in rules) || isObjectEmpty(rules[updateKey] as Record<string, unknown>)) {
                original[updateKey] = updateValue;
                return; // go to the next property of update object
            } // no else, continue with applying rules

            const rulesForKey: PrimitiveRule | ComplexRules<T[keyof T]> = rules[updateKey];

            // choose a strategy based on the data type, primitive is default
            let strategy: UpdateStrategy;
            if (Array.isArray(updateValue) && Array.isArray(originalValue)) {
                strategy = this._strategies.array;
            } else if (isObject(updateValue) && isObject(originalValue)) {
                strategy = this._strategies.object;
            } else {
                strategy = this._strategies.primitive;
            }
            strategy.update(original, updateValue, updateKey, rulesForKey as ComplexRules<T>);
        });

        return original;
    }

}



