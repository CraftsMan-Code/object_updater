/*!
 * Copyright © 2024 Object Updater
 */

/**
 * Defines a strategy for updating an object.
 * It declares an update method that takes an original object, a value to update with,
 * a key of the property to be updated, and the rules for updating.
 */
export interface UpdateStrategy {
    update<T>(
        original: T, 
        updateValue: T[keyof T] | undefined, 
        updateKey: keyof T, 
        rulesForKey: ComplexRules<T> | PrimitiveRule
    ): void;
}

/**
* Defines the possible actions that can be performed when updating an object.
*/
export enum UpdateAction {
    /** Deletes the property from the original object */
    DELETE = 'DELETE',
    /** Ignores the update and makes no changes to the original object */
    IGNORE = ' IGNORE',
    /** Replaces the value of the property in the original object with the update value */
    REPLACE = 'REPLACE',
    /** Additional Array rules */
    /** Merges original values with update, no check for duplicates */
    MERGE = 'MERGE',
    /** Merges original values with update, no duplicates */
    UNION = 'UNION',
    /** update if exists, insert if not */
    UPSERT_BY_KEY = 'UPSERT_BY_KEY',
    // PATCH_BY_KEY = 'PATCH_BY_KEY'
}

/**
 * Defines a rule for updating a primitive data type.
 * It contains an action property that specifies the update action to be performed.
 */
export interface PrimitiveRule {
    /** Represents action for update */
    action: UpdateAction;
    /** 
     * Represents update key for arrays of objects.
     * 
     */
    mergeKey?: string; 
}

/**
 * Defines a set of rules for updating complex data types.
 * It is a recursive interface where each key corresponds to a PrimitiveRule or a nested ComplexRules object.
 */
// export interface ComplexRules { 
//     [key: string]: PrimitiveRule | ComplexRules
// }

// export type ComplexRules<T> = {
//     [K in keyof T]: T[K] extends object ? ComplexRules<T[K]> : PrimitiveRule;
// };


export type ComplexRules<T> = {
    [K in keyof T]: T[K] extends object
        ? PrimitiveRule | ComplexRules<T[K]> // Allow either a PrimitiveRule or further nested ComplexRules
        : PrimitiveRule;                     // Require PrimitiveRule for non-object types
};