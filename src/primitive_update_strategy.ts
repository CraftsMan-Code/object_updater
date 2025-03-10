/*!
 * Copyright © 2024 Object Updater
 */

import { isObject } from "./helpers/helpers";
import { ComplexRules, PrimitiveRule, UpdateAction, UpdateStrategy } from "./interfaces";

export class PrimitiveUpdateStrategy implements UpdateStrategy {

    update<T>(
        original: T,
        updateValue: T[keyof T],
        updateKey: keyof T,
        rulesForKey: ComplexRules<T> | PrimitiveRule
    ): void {
        if ('action' in rulesForKey && !isObject(rulesForKey.action)) {
            switch (rulesForKey.action) {
                case UpdateAction.DELETE:
                    // console.log('delete ', updateKey);
                    delete original[updateKey];
                    return;
                case UpdateAction.IGNORE:
                    return;
                case UpdateAction.REPLACE:
                default:
                    original[updateKey] = updateValue;
                    return;
            }
        }
    }
}