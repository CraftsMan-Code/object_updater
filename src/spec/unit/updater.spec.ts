/*!
 * Copyright © 2025 Object Updater
 */

import { UpdateAction } from "../../interfaces";
import { Updater } from "../../updater";

describe('Updater', () => {
    describe('updateObject', () => {
        const updater: Updater = new Updater();
        it('Should update the original object with the provided updates without any rules', () => {
            const original = {
                color: 'red',
                type: 'car'
            };

            const update = {
                color: 'blue'
            };

            const updated = updater.updateObject(original, update);
            expect(updated).toEqual({ color: 'blue', type: 'car' });
        });

        it('Should update the original object with the provided updates with rules', () => {
            const original = {
                color: 'red',
                type: 'car'
            };

            const update = {
                color: 'blue'
            };

            const rules = {
                color: {
                    action: UpdateAction.REPLACE
                },
                type: {
                    action: UpdateAction.IGNORE
                }
            };

            const updated = updater.updateObject(original, update, rules);
            expect(updated).toEqual({ color: 'blue', type: 'car' });
        });

        it('Should update the original object with the provided updates with nested rules', () => {
            const original = {
                color: 'red',
                type: 'car',
                parts: {
                    wheels: 4,
                    doors: 2
                }
            };

            const update = {
                parts: {
                    wheels: 6
                }
            };

            const rules = {
                parts: {
                    wheels: {
                        action: UpdateAction.REPLACE
                    },
                    doors: {
                        action: UpdateAction.IGNORE
                    }
                }
            };
            // @ts-ignore: need to update rules interface
            const updated = updater.updateObject(original, update, rules);
            expect(updated).toEqual({ color: 'red', type: 'car', parts: { wheels: 6, doors: 2 } });
        });

        it('Should update the original object with the provided updates with nested rules and array', () => {
            const original = {
                color: 'red',
                type: 'car',
                parts: {
                    wheels: 4,
                    doors: 2,
                    features: ['radio']
                }
            };

            const update = {
                parts: {
                    features: ['radio', 'gps']
                }
            };

            const rules = {
                parts: {
                    features: {
                        action: UpdateAction.UNION
                    }
                }
            };
            // @ts-ignore: need to update rules interface
            const updated = updater.updateObject(original, update, rules);
            expect(updated).toEqual({ color: 'red', type: 'car', parts: { wheels: 4, doors: 2, features: ['radio', 'gps'] } });
        });
        it('Should update the original object with the provided updates with nested rules and array of objects', () => {
            const original = {
                color: 'red',
                type: 'car',
                parts: {
                    wheels: 4,
                    doors: 2,
                    features: [{ type: 'radio' }]
                }
            };

            const update = {
                parts: {
                    features: [{ type: 'gps' }]
                }
            };

            const rules = {
                parts: {
                    features: {
                        type: {
                            action: UpdateAction.REPLACE
                        }
                    }
                }
            };
            // @ts-ignore: need to update rules interface
            const updated = updater.updateObject(original, update, rules);
            expect(updated).toEqual({ color: 'red', type: 'car', parts: { wheels: 4, doors: 2, features: [{ type: 'gps' }] } });
        });
        it('Should update the original object with the provided updates with nested rules and array of objects with using UPSERT_BY_KEY rule', () => {
            const original = {
                color: 'red',
                type: 'car',
                parts: {
                    wheels: 4,
                    doors: 2,
                    features: [
                        { type: 'radio', id: 1 },
                        { type: 'wifi', id: 2 }
                    ]
                }
            };

            const update = {
                parts: {
                    features: [{ type: 'gps', id: 2 }]
                }
            };

            const rules = {
                parts: {
                    features: {
                        action: UpdateAction.UPSERT_BY_KEY,
                        mergeKey: 'id'
                    }
                }
            };
            // @ts-ignore: need to update rules interface
            const updated = updater.updateObject(original, update, rules);
            expect(updated).toEqual(
                { color: 'red', type: 'car', parts: { wheels: 4, doors: 2, features: [{ type: 'radio', id: 1 }, { type: 'gps', id: 2 }] } }
            );
        });
    });
})