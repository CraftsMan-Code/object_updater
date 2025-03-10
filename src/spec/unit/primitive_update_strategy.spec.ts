/*!
 * Copyright © 2025 Object Updater
 */

import { UpdateAction } from '../../interfaces';
import { PrimitiveUpdateStrategy } from '../../primitive_update_strategy'

describe('PrimitiveUpdateStrategy', () => {

    describe('update', () => {
        const updateStrategy: PrimitiveUpdateStrategy = new PrimitiveUpdateStrategy()
        it('should delete the property from original', () => {
            const original = {
                name: 'John'
            }
            const update = '';
            updateStrategy.update(original, update, 'name', { action: UpdateAction.DELETE })
            expect(original).toEqual({})
        });
        it('should ignore the update', () => {
            const original = {
                name: 'John'
            }
            const update = 'Jane';
            updateStrategy.update(original, update, 'name', { action: UpdateAction.IGNORE })
            expect(original).toEqual({ name: 'John' })
        });
        it('should replace the property in original', () => {
            const original = {
                name: 'John'
            }
            const update = 'Jane';
            updateStrategy.update(original, update, 'name', { action: UpdateAction.REPLACE })
            expect(original).toEqual({ name: 'Jane' })
        });
    });

});