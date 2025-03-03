// file 

import { ComplexRules, UpdateAction } from "./interfaces";
import { Updater } from "./updater";

interface Description {
    lang: string;
    text: string;
    id: string;
    opt?: string;
}


interface Address {
    name: string;
    age: number
    city: string;
    location?: {
        long: string,
        lang: string,
        opt?: number,
    }
    descriptions?: Description[]
    // descriptions?: string[]
    [index: string]: unknown;

    o?: {
        o: any[]
    }
}




const original: Address = {
    name: 'Johan',
    age: 55,
    city: 'Toronto',
    descriptions: [
        {
            lang: '1',
            text: '1',
            id: '54321'
        }
    ],
    o: {
        o: ['10']
    }
    // descriptions: ['xyz']

    // location: {
    //     long: '1223',
    //     lang: '4321',
    //     opt: 99
    // }
    
}

const update: Address = {
    name: 'Marcel',
    age: 37,
    city: 'Toronto',
    location: {
        long: 'new_123',
        lang: '4321_321',
    },
    // descriptions: ['abc', '123', 'xyz']

    descriptions: [
        {
            id: '12345',
            lang: '1',
            text: '1',
            
        },
        {
            text: 'xxxx',
            lang: 'abc',
            id: '54321',
            opt: 'Here'
        }
    ],
    o: {
        o: ['120']
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
        action: UpdateAction.REPLACE,
    },
    descriptions: {
        action: UpdateAction.UPSERT_BY_KEY,
        mergeKey: 'id'
    },
    o: {
        // @ts-ignore
        o: {
            action: UpdateAction.UNION
        }
    }
}


const updater: Updater = new Updater();

//console.log(updater.updateObject(original, update, rules))


try {
    console.log(updater.updateObject(original, update, rules))
} catch (e) {
    // @ts-ignore
    console.log(e.message);
    
}