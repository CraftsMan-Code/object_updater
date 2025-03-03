# Object Updater

## Table of contents
 
- [Object Updater](#object-updater)
  - [Table of contents](#table-of-contents)
  - [Definitions](#definitions)
  - [Design](#design)
    - [Update Rules](#update-rules)
    - [Update Process](#update-process)


## Definitions

TBD

## Design

### Update Rules

**General Rules**

- `REPLACE` - The target value will be replaced with new one
- `IGNORE` - The target value will not be changed
- `DELETE` - The the target property will be removed from the result object

**Additional Array Rules**

- `MERGE`: property is merged with the update (no check for duplicates).
- `UNION`: property is merged with the update, no duplicates.

### Update Process

```mermaid
stateDiagram-v2
    [*] --> Update
    state propertyRule <<choice>>
    state allPropertyProcessed <<choice>>
    state dataType <<choice>>
    state findAction <<choice>>

    Update --> Loop
    Loop --> Property
    Property --> propertyRule
    
    note left of propertyRule
        Checks if the property has a rule
    end note
    propertyRule --> REPLACE: No, replace at the 1st nesting level
    propertyRule --> dataType: Yes

    note left of dataType
        Checks the data type of the property
    end note
    dataType --> Primitive
    dataType --> Object
    
    Primitive --> ProcessRule
    Object --> findAction

    note left of findAction
        Checks if the nested object has its own rule
    end note
    findAction --> ProcessRule: Yes, update entire nested object
    findAction --> Update: No, nested object is recursively updated through each property

    ProcessRule --> REPLACE
    ProcessRule --> DELETE
    ProcessRule --> IGNORE

    REPLACE --> allPropertyProcessed: Replace value
    DELETE --> allPropertyProcessed: Remove prop from object
    IGNORE --> allPropertyProcessed: Do nothing

    allPropertyProcessed --> [*]
```





