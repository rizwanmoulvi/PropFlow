// components/Form.js
import mintToken from '../flow/transaction/MintToken.tx';
// import { config} from "@onflow/fcl";

import React, {useState} from 'react';
// Import the `FileSelector` module, which does not exist yet. 
import FileSelector from './FileSelector';

// Collect the information of a pet and manage as a state
// and mint the NFT based on the information.
// config()
//   .put("accessNode.api", "http://localhost:8888") // Default Flow Emulator address
//   .put("discovery.wallet", "http://localhost:3569/fcl/authn")

const Form = () => {
  const [pet, setPet] = useState({});

  // Helper callback functions to be passed to input elements' onChange.

  // Update the state of the pet's name.
  const setName = (event) => {
    const name = event.target.value;
    setPet({...pet, name});
  }

  // Update the state of the pet's breed.
  const setBreed = (event) => {
    const breed = event.target.value;
    setPet({...pet, breed});
  }

  // Update the state of the pet's age.
  const setAge = (event) => {
    const age = event.target.value;
    setPet({...pet, age});
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await mintToken(pet);
    } catch (err) {
      console.error(err);
    }
  }

  

  return (
    <div style={style}>
      <form onSubmit={handleSubmit}>
        <div className="row">
            <FileSelector pet={pet} setPet={setPet} />
            <div>
            <label htmlFor="nameInput">Pet's name</label>
            <input
              className="u-full-width"
              type="text"
              placeholder="Max"
              id="nameInput"
              onChange={setName}
            />
            </div>
            <div>
            <label htmlFor="breedInput">Animal</label>
            <select className="u-full-width" id="breedInput" onChange={setBreed}>
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
            </select>
            </div>
            <div>
            <label htmlFor="ageInput">Age</label>
              <select
                className="u-full-width"
                id="ageInput"
                onChange={setAge}
              >
                {
                  [...Array(10).keys()].map(i => <option key={i} value={i}>{i}</option>)
                }
              </select>
            </div>
          </div>
        <input className="button-primary" type="submit" value="Mint" />
      </form>
    </div>
  );
};

const style = {
  padding: '5rem',
  background: 'white',
  maxWidth: 350,
};

export default Form;