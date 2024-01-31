import { useState, useEffect } from 'react';

import getAllTokenIds from '../flow/script/GetAllTokenIds.sc';
import getTokenMetadata from '../flow/script/GetTokenMetadata.sc';
import { toGatewayURL } from 'nft.storage';

// QueryForm.jsx

const style = {
  padding: '1rem',
  paddingTop: '5rem',
  background: 'white',
  maxWidth: 350,
  margin: 'auto',
};

const QueryForm = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [allTokenIds, setAllTokenIds]  = useState([]);

  useEffect(() => {
    let getTokens = async () => {
      // Set mock IDs for now
      const ids = await getAllTokenIds();
      setTokenIds(ids);
    };
    getTokens();
  }, []);

  // Empty handler for now...
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
        // Call the `getTokenMetadata` function and extract the
        // IPFS URL from the data returned.
        let metadata = await getTokenMetadata(selectedId);
        let dataURL = toGatewayURL(metadata.url);
  
        // Fetch the URL to get a JSON response, which contains
        // an `image` attribute.
        // create a new metadata object and set the metadata to the value.
        let { image } = await (await fetch(dataURL)).json();
        let newdata = { ...metadata, image: toGatewayURL(image) };
        setMetadata(newdata);
      } catch(err) {
        window.alert('Token ID does not exist!');
      }
  }

  return (
    <div style={style}>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="">
            <label htmlFor="idInput">Pet's ID</label>
            <select
              className="u-full-width"
              type="number"
              id="idInput"
              onChange={(event) => setId(parseInt(event.target.value))}
            >
              {
                // We want to display token IDs that are available.
                allTokenIds.map(i => <option value={i}>{i}</option>)
              }
            </select>
          </div>
        </div>
        <input className="button-primary" type="submit" value="Query" />
      </form>
      {
        // We only display the table if there's metadata.
        metadata ? <MetadataTable metadata={metadata} /> : null
      }
    </div>
  );
};

const MetadataTable = ({ metadata }) => (
  <table className="u-full-width">
    <thead>
      <tr>
        {
          Object.keys(metadata).map((field,i) => (
            // Skip the `url` attribute in metadata for the table headings.
            field === 'url' ? null : <th key={i}>{field}</th>
          ))
        }
      </tr>
    </thead>
    <tbody>
      <tr>
        {
          Object.keys(metadata).map((field, i) => {
            switch (field) {
              // Skip displaying the url.
              case 'url':
                return null;
              // Display the image as <img> tag.
              case 'image':
                return (
                  <td key={i}>
                    <img src={metadata[field]} width="60px" />
                  </td>
                );
              // Default is to display data as text.
              default:
                return <td key={i}>{metadata[field]}</td>;
            }
          })
        }
      </tr>
    </tbody>
  </table>
);

export default QueryForm;