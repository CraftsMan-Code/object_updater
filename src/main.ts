/*!
 * Copyright © 2025 Object Updater
 */

import { ComplexRules, UpdateAction } from "./interfaces";
import { Updater } from "./updater";


const updater: Updater = new Updater();
const updateObject = updater.updateObject.bind(updater);

/** @public */
export { updateObject, ComplexRules, UpdateAction };