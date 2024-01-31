import * as fcl from '@onflow/fcl';
import raw from './GetAllTokenIds.cdc';

async function getAllTokenIds() {

  // Fetch the `GetAllTokenIds.cdc` script as text.
  let cdc = await(await fetch(raw)).text();

  // Read the script, send it, and wait for the response.
  const encoded = await fcl.send([fcl.script(cdc)]);

  // Decode the response into a JavaScript array of IDs.
  const tokenIds = await fcl.decode(encoded);

  // Sort the IDs in ascending order and return the array.
  return tokenIds.sort((a, b) => a - b);
}

export default getAllTokenIds;