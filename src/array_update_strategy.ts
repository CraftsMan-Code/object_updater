/*!
 * Copyright © 2024 Object Updater
 */

import { ComplexRules, PrimitiveRule, UpdateStrategy } from "./interfaces"

/**
 * This class provides an update method for updating array data types.
 * This class implements the UpdateStrategy interface.
 */
export class ArrayUpdateStrategy implements UpdateStrategy {
    public update<T>(original: T,
        _updateValue: T[keyof T] | undefined,
        _updateKey: keyof T,
        _rulesForKey: ComplexRules<T> | PrimitiveRule
    ): void {
        // TODO: implement array strategy
        console.log(`Array updating for: ${original} is not implemented yet`)
    }
}