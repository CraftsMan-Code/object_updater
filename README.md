# Generic object updater with rules

## Overview

This Generic Object Updater is a TypeScript-based utility designed to update JSON objects while applying customizable rules.
It allows deep updates, supports arrays, and provides granular control over merging, replacing, deleting, and ignoring fields.
With Generic Object Updater, you can safely update complex nested objects while ensuring your rules dictate how properties are modified.

## Install

```bash
npm install object-updater
```

## Rules

The `UpdateAction` enum defines how properties should be updated in an object.

| Action        | Description                                                    |
| ------------- | -------------------------------------------------------------- |
| DELETE        | Removes the property from the original object.                 |
| IGNORE        | Keeps the original value, ignoring the update.                 |
| REPLACE       | Fully replaces the existing value with the new one.            |
| MERGE         | Merges arrays without checking for duplicates.                 |
| UNION         | Merges arrays while ensuring no duplicate values.              |
| UPSERT_BY_KEY | Updates an object in an array if it exists; inserts it if not. |


The `PrimitiveRule` interface defines how individual properties should be updated based on their data type.

```TypeScript
interface PrimitiveRule {
    /** Represents action for update */
    action: UpdateAction;
    /** 
     * Represents update key for arrays of objects.
     * Could be used only with UpdateAction.UPSERT_BY_KEY
    */
    mergeKey?: string;
}
```

### Example Usage

```TypeScript
const rules: Record<string, PrimitiveRule> = {
    name: { action: UpdateAction.REPLACE },  // Always replace `name`
    age: { action: UpdateAction.IGNORE },    // Ignore updates to `age`
    tags: { action: UpdateAction.UNION },    // Merge `tags`, removing duplicates
    users: { action: UpdateAction.UPSERT_BY_KEY, mergeKey: "id" } // Upsert objects in `users` by `id`
};
```

### How Rules Work in Object Updates

Rules `define the update behavior` for each property of an object. The UpdateAction determines whether a value 
is `merged`, `replaced`, `ignored`, `deleted`, or `upserted`.


```TypeScript
import { ComplexRules, UpdateAction, Updater } from "object_updater";

const original = {
    name: "Alice",
    age: 30,
    tags: ["developer", "engineer"],
    users: [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" }
    ]
};

const update = {
    name: "Alice Johnson",
    age: 31,
    tags: ["engineer", "designer"], // New tags
    users: [
        { id: 2, name: "Bobby" },  // Update Bob's name
        { id: 3, name: "Charlie" } // Add a new user
    ]
};

const rules: Record<string, PrimitiveRule> = {
    name: { action: UpdateAction.REPLACE },  // Replace `name`
    age: { action: UpdateAction.IGNORE },    // Ignore `age`
    tags: { action: UpdateAction.UNION },    // Merge `tags`, removing duplicates
    users: { action: UpdateAction.UPSERT_BY_KEY, mergeKey: "id" } // Upsert users by `id`
};

// Apply the update with rules
const updatedObject = updateObject(original, update, rules);

console.log(updatedObject);
/*
{
    name: "Alice Johnson",
    age: 30,  // Age remains unchanged due to IGNORE
    tags: ["developer", "engineer", "designer"],  // Merged without duplicates
    users: [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bobby" },  // Bob's name updated
        { id: 3, name: "Charlie" } // New user added
    ]
}
*/
```
