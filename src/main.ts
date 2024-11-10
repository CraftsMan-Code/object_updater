// file 

import { ComplexRules, UpdateAction } from "./interfaces";
import { Updater } from "./updater";


interface Address {
    name: string;
    age: number
    city: string;
    location: {
        long: string,
        lang: string,
        opt?: number
    }
}


const original: Address = {
    name: 'Johan',
    age: 55,
    city: 'Toronto',
    location: {
        long: '1223',
        lang: '4321',
        opt: 99
    }
}

const update: Address = {
    name: 'Marcel',
    age: 37,
    city: 'Toronto',
    location: {
        long: 'new_123',
        lang: '4321_321',
    }
}

const rules: ComplexRules<Address> = {
    name: {
        action: UpdateAction.DELETE,
    },
    city: {
        action: UpdateAction.IGNORE
    },
    age: {
        action: UpdateAction.REPLACE
    },
    location: {
        action: UpdateAction.REPLACE
    }
}


const updater: Updater = new Updater();

console.log(updater.updateObject(original, update, rules))