// MintToken.tx.js
// Import required modules from nft.storage
import { NFTStorage, File } from 'nft.storage';
import { config } from "@onflow/fcl"
import * as fcl from '@onflow/fcl';
import * as t from '@onflow/types';
import cdc from './MintToken.cdc';


const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGJmN2FEMTIxRUJkM2EwMkI0NGJGZWU5YTgzNDM2NURhOTE4NkE2NUIiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTcwNjcwODU5NzE0NCwibmFtZSI6IlByb3BGbG93In0.s_7punB08-X8sZqzDrOftBOlLbrZGAl_u_V5K5a4gAg";
const storage = new NFTStorage({ token: API_KEY });

config({
  "accessNode.api": "http://localhost:8888",
  "discovery.wallet": "http://localhost:8888/fcl/authn"
})
async function mintToken(pet) {
    // let metadata = await uploadToStorage(pet);
    // let txId = await mintPet(metadata);

    const { url } = await uploadToStorage(pet);
    const txId = await mintPet({ ...pet, url });

    return txId;
  }
  export default mintToken;
  
  // We will fill in these functions next
  
  async function uploadToStorage(pet) {
    let metadata = await storage.store({
        ...pet,
        image: pet.image && new File([pet.image], `${pet.name}.jpg`, { type: 'image/jpg' }),
        description: `${pet.name}'s metadata`,
      });
    
      // If all goes well, return the metadata.
      return metadata;
  }
  
  async function mintPet(metadata) {
    const dict = toCadenceDict(metadata);

    // Build a list of arguments
    const payload = fcl.args([
      fcl.arg(
        dict,
        t.Dictionary({ key: t.String, value: t.String }),
      )
    ]);
  
    // Fetch the Cadence raw code.
    const code = await (await fetch(cdc)).text();
  
    // Send the transaction!
    // Note the `userauthenticate` function we have not implemented.
    const encoded = await fcl.send([
      fcl.transaction(code),
      fcl.payer(fcl.authenticate),
      fcl.proposer(fcl.authenticate),
      fcl.authorizations([fcl.authenticate]),
      fcl.limit(999),
      payload,
    ]);
  
    // Call `fcl.decode` to get the transaction ID.
    let txId = await fcl.decode(encoded);
  
    // This waits for the transaction to be sealed, which is a recommended way.
    await fcl.tx(txId).onceSealed();
  
    // Return the transaction ID
    return txId;
  }
  
  // Helper function to convert `pet` object to a {String: String} type.
  function toCadenceDict(pet) {
    // Copy the pet object so we don't mutate the original.
    let newPet = {...pet};
  
    // Delete the `image` attribute that contains a `File` object.
    delete newPet.image;
  
    // Return an array of [{key: string, value: string}].
    return Object.keys(newPet).map((k) => ({key: k, value: pet[k]}));
  }