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
                    delete original[updateKey];
                    break;
                case UpdateAction.IGNORE:
                    break;
                case UpdateAction.REPLACE:
                default:
                    original[updateKey] = updateValue;
                    break;
            }
        }
    }
}