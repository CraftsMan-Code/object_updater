/*!
 * Copyright © 2025 Object Updater
 */

import { ArrayUpdateStrategy } from "../../array_update_strategy"
import { PrimitiveRule, UpdateAction } from "../../interfaces";

describe('ArrayUpdateStrategy', () => {

    describe('update', () => {
        const arrayUpdateStrategy: ArrayUpdateStrategy = new ArrayUpdateStrategy();
        it('should delete the property when action is DELETE', () => {
            const original = {
                colors: ['white', 'black']
            }
            const update = ['pink', 'purple'];

            const expectedResult = {}

            arrayUpdateStrategy.update(original, update, 'colors', { action: UpdateAction.DELETE })
            expect(original).toEqual(expectedResult)
        });

        it('should ignore the property when action is IGNORE', () => {
            const original = {
                colors: ['white', 'black']
            }
            const update = ['pink', 'purple'];

            const expectedResult = { colors: ['white', 'black'] }

            arrayUpdateStrategy.update(original, update, 'colors', { action: UpdateAction.IGNORE })
            expect(original).toEqual(expectedResult)
        });

        it('should merge the property when action is MERGE', () => {
            const original = {
                colors: ['white', 'black']
            }
            const update = ['pink', 'black', 'purple'];

            const expectedResult = { colors: ['white', 'black', 'pink', 'black', 'purple'] }

            arrayUpdateStrategy.update(original, update, 'colors', { action: UpdateAction.MERGE })
            expect(original).toEqual(expectedResult)
        });

        it('should union the property when action is UNION', () => {
            const original = {
                colors: ['white', 'black']
            }
            const update = ['pink', 'black', 'purple'];

            const expectedResult = { colors: ['white', 'black', 'pink', 'purple'] }

            arrayUpdateStrategy.update(original, update, 'colors', { action: UpdateAction.UNION })
            expect(original).toEqual(expectedResult)
        });
        it('should upsert the property when action is UPSERT_BY_KEY and mergeKey is specified', () => {
            const original = {
                colors: [
                    { name: 'white', value: 1 },
                    { name: 'black', value: 2 }
                ]
            }
            const update = [
                { name: 'white', value: 3 },
                { name: 'purple', value: 4 }
            ];

            const expectedResult = {
                colors: [
                    { name: 'white', value: 3 },
                    { name: 'black', value: 2 },
                    { name: 'purple', value: 4 }
                ]
            }

            arrayUpdateStrategy.update(
                original,
                update,
                'colors',
                { action: UpdateAction.UPSERT_BY_KEY, mergeKey: 'name' }
            )
            expect(original).toEqual(expectedResult)
        });

        it('should replace the property when action is REPLACE', () => {
            const original = {
                colors: ['white', 'black']
            }
            const update = ['pink', 'purple'];

            const expectedResult = { colors: ['pink', 'purple'] }

            arrayUpdateStrategy.update(original, update, 'colors', { action: UpdateAction.REPLACE })
            expect(original).toEqual(expectedResult)
        });

        it('should replace the property when action is missing in rulesForKey', () => {
            const original = {
                colors: ['white', 'black']
            }
            const update = ['pink', 'purple'];

            const expectedResult = { colors: ['pink', 'purple'] }

            arrayUpdateStrategy.update(original, update, 'colors', {} as PrimitiveRule)
            expect(original).toEqual(expectedResult)
        });
    })

    describe('merge', () => {
        const arrayUpdateStrategy: ArrayUpdateStrategy = new ArrayUpdateStrategy();
        it('should merge original array with update when provided values', () => {
            const original = {
                colors: ['white', 'black']
            }
            const update = ['pink', 'purple'];

            const expectedResult = { colors: ['white', 'black', 'pink', 'purple'] };

            arrayUpdateStrategy['merge'](original, 'colors', update)
            expect(original).toEqual(expectedResult)
        });

        it('should throw an error when original array and update array are not of the same data type', () => {
            const original = {
                colors: ['white', 'black']
            }
            const update = 'pink';

            expect(() => arrayUpdateStrategy['merge'](original, 'colors', update as any as string[])).toThrow(`Expected an array for key 'colors'`);
        });
    });

    describe('union', () => {
        const arrayUpdateStrategy: ArrayUpdateStrategy = new ArrayUpdateStrategy();
        it('should throw an error when original array and update array are not of the same data type', () => {
            const original = {
                colors: ['white', 'black']
            }
            const update = 'pink';

            expect(() => arrayUpdateStrategy['union'](original, 'colors', update as any as string[]))
                .toThrow(`Expected an array for key 'colors'`);
        });
        it('should union the original array with the update array of objects, no duplicates', () => {
            const original = {
                colors: [
                    { name: 'white', value: 1 },
                    { name: 'black', value: 2 }
                ]
            }
            const update = [
                { name: 'white', value: 1 },
                { name: 'purple', value: 4 }
            ];

            const expectedResult = {
                colors: [
                    { name: 'white', value: 1 },
                    { name: 'black', value: 2 },
                    { name: 'purple', value: 4 }
                ]
            };

            arrayUpdateStrategy['union'](original, 'colors', update)
            expect(original).toEqual(expectedResult)
        })
    });

    describe('upsertByKey', () => {
        const arrayUpdateStrategy: ArrayUpdateStrategy = new ArrayUpdateStrategy();
        it('should upsert the property when action is UPSERT_BY_KEY and mergeKey is specified', () => {
            const original = {
                colors: [
                    { name: 'white', value: 1 },
                    { name: 'black', value: 2 }
                ]
            }
            const update = [
                { name: 'white', value: 3 },
                { name: 'purple', value: 4 }
            ];

            const expectedResult = {
                colors: [
                    { name: 'white', value: 3 },
                    { name: 'black', value: 2 },
                    { name: 'purple', value: 4 }
                ]
            }

            arrayUpdateStrategy['upsertByKey'](
                original,
                'colors',
                update,
                'name'
            )
            expect(original).toEqual(expectedResult)
        });

        it('should throw an error when original array and update array are not of the same data type', () => {
            const original = {
                colors: ['white', 'black']
            }
            const update = 'pink';

            expect(() => arrayUpdateStrategy['upsertByKey'](original, 'colors', update as any as string[]))
                .toThrow(`Expected an array for key 'colors'`);
        });
        it('should throw an error when the data type is not supported', () => {
            const original = {
                colors: ['white', 'black']
            }
            const update = ['pink', 'purple'];

            expect(() => arrayUpdateStrategy['upsertByKey'](original, 'colors', update as any as string[]))
                .toThrow(`Cannot perform update on 'colors', the 'UPSERT_BY_KEY' is available only for array of objects`);
        });

        it('should throw an error when the UPSERT_BY_KEY requires mergeKey to be defined', () => {
            const original = {
                colors: [
                    { name: 'white', value: 1 },
                    { name: 'black', value: 2 }
                ]
            }
            const update = [
                { name: 'white', value: 3 },
                { name: 'purple', value: 7 }
            ];

            expect(() => arrayUpdateStrategy['upsertByKey'](original, 'colors', update as any))
                .toThrow(`Cannot perform update on 'colors', the UPSERT_BY_KEY requires mergeKey to be defined`);
        })
    });

    describe('isObjectType', () => {
        const arrayUpdateStrategy: ArrayUpdateStrategy = new ArrayUpdateStrategy();
        it('should return true when the data type of the array is an object', () => {
            const originalValue = [
                { name: 'white', value: 1 },
                { name: 'black', value: 2 }
            ];
            const updateValue = [
                { name: 'white', value: 3 },
                { name: 'purple', value: 4 }
            ];
            expect(arrayUpdateStrategy['isObjectType'](originalValue, 'name', updateValue)).toBeTruthy();
        });

        it('should return false when the data type of the array is not an object', () => {
            const originalValue = ['white', 'black'];
            const updateValue = ['pink', 'purple'];
            expect(arrayUpdateStrategy['isObjectType'](originalValue, 'name' as any, updateValue)).toBeFalsy();
        });

        it('should throw an error when the attribute array must hold only one data type', () => {
            const originalValue = [
                { name: 'white', value: 1 },
                "black"
            ];
            const updateValue = ['pink', 1];
            expect(() => arrayUpdateStrategy['isObjectType'](originalValue, 'name' as never, updateValue as any))
                .toThrow(`The attribute array 'name' must hold only one data type`);
        });
        it('should throw an error when the data type is not supported', () => {
            const originalValue = [Symbol('abc')];
            const updateValue = [Symbol('abc')];
            expect(() => arrayUpdateStrategy['isObjectType'](originalValue, 'name' as any, updateValue as any))
                .toThrow(`Not supported datatype: 'symbol' for attribute: 'name'`);
        })
    });

    describe('mergeArrayOfObjectsNoDuplicates', () => {
        const arrayUpdateStrategy: ArrayUpdateStrategy = new ArrayUpdateStrategy();
        it('should merge the original array with the update array, no duplicates (all different objects)', () => {
            const original = [
                { name: 'white', value: 1 },
                { name: 'black', value: 2 }
            ];
            const update = [
                { name: 'white', value: 3 },
                { name: 'purple', value: 4 }
            ];

            const expectedResult = [
                { name: 'white', value: 1 },
                { name: 'black', value: 2 },
                { name: 'white', value: 3 },
                { name: 'purple', value: 4 },
            ];
            expect(arrayUpdateStrategy['mergeArrayOfObjectsNoDuplicates'](original, update)).toEqual(expectedResult);
        });
        it('should merge the original array with the update array, no duplicates', () => {
            const original = [
                { name: 'white', value: 1 },
                { name: 'black', value: 2 }
            ];
            const update = [
                { name: 'white', value: 3 },
                { name: 'black', value: 2 }
            ];

            const expectedResult = [
                { name: 'white', value: 1 },
                { name: 'black', value: 2 },
                { name: 'white', value: 3 },
            ];
            expect(arrayUpdateStrategy['mergeArrayOfObjectsNoDuplicates'](original, update)).toEqual(expectedResult);
        });
    });

    describe('normalizeObject', () => {
        it('should return the object as is when it is already normalized', () => {
            const arrayUpdateStrategy: ArrayUpdateStrategy = new ArrayUpdateStrategy();
            const object = { value: 1, name: 'white' };
            const expectedResult = '{"name":"white","value":1}';
            expect(arrayUpdateStrategy['normalizeObject'](object)).toEqual(expectedResult);
        });
    });
});