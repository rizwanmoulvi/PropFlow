// GetTokenMetadata.sc.js

import * as fcl from '@onflow/fcl';
import * as t from '@onflow/types';
import raw from './GetTokenMetadata.cdc';

async function getTokenMetadata(id) {
    let script = await(await fetch(raw)).text();
    const encoded = await fcl.send([
        fcl.script(script),
        fcl.args([fcl.arg(id, t.UInt64)]),
    ]);
    const data = await fcl.decode(encoded);
    return data;
}

export default getTokenMetadata;
