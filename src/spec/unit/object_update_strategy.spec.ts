/*!
 * Copyright © 2025 Object Updater
 */

import { UpdateAction } from "../../interfaces";
import { ObjectUpdateStrategy } from "../../object_update_strategy";
import { Updater } from "../../updater";

describe('ObjectUpdateStrategy', () => {
    describe('update', () => {
        const objectUpdateStrategy: ObjectUpdateStrategy = new ObjectUpdateStrategy(new Updater());
        it('Should delete property in original when action is DELETE', () => {
            const original = {
                color: 'red',
                type: 'car'
            };

            const rulesForKey = { action: UpdateAction.DELETE };
            objectUpdateStrategy.update(original, {} as any, 'color', rulesForKey);
            expect(original).toEqual({ type: 'car' });
        });
        it('Should ignore the update when action is IGNORE', () => {
            const original = {
                color: 'red',
                type: 'car'
            };

            const rulesForKey = { action: UpdateAction.IGNORE };
            objectUpdateStrategy.update(original, 'blue', 'color', rulesForKey);
            expect(original).toEqual({ color: 'red', type: 'car' });
        });
        it('Should replace the property in original when action is REPLACE', () => {
            const original = {
                color: 'red',
                type: 'car'
            };

            const rulesForKey = { action: UpdateAction.REPLACE };
            objectUpdateStrategy.update(original, 'blue', 'color', rulesForKey);
            expect(original).toEqual({ color: 'blue', type: 'car' });
        });
        it('Should throw error when action is UPSERT_BY_KEY', () => {
            const original = {
                color: 'red',
                type: 'car'
            };

            const rulesForKey = { action: UpdateAction.UPSERT_BY_KEY };
            expect(() => objectUpdateStrategy.update(original, 'blue', 'color', rulesForKey))
                .toThrow("Cannot perform update on 'color',the 'UPSERT_BY_KEY' is available only for array of objects");
        });
        it('Should update nested object in original', () => {
            const original = {
                color: 'red',
                type: 'car',
                details: {
                    model: '2021',
                    price: 20000
                }
            };

            const rulesForKey = { action: UpdateAction.REPLACE };
            objectUpdateStrategy.update(
                original,
                { model: '2022', price: 250 },
                'details',
                rulesForKey
            );
            expect(original).toEqual({
                color: 'red',
                type: 'car',
                details: {
                    model: '2022',
                    price: 250
                }
            });
        });
        it('Should update nested object in original with rules', () => {
            const original = {
                color: 'red',
                type: 'car',
                details: {
                    model: '2021',
                    price: 20000
                }
            };
            const rulesForKey = {
                color: { action: UpdateAction.IGNORE },
                type: { action: UpdateAction.IGNORE },
                details: {
                    model: { action: UpdateAction.REPLACE },
                    price: { action: UpdateAction.REPLACE }
                }
            };
            objectUpdateStrategy.update(
                original,
                { model: '2022', price: 250 },
                'details',
                rulesForKey
            );
            expect(original).toEqual({
                color: 'red',
                type: 'car',
                details: {
                    model: '2022',
                    price: 250
                }
            });
        });
    });
});