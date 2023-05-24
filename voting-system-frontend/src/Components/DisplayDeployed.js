import React, { useRef, useEffect, useState } from 'react';
import { createClient } from 'urql';
import { Link } from 'react-router-dom';
import { convertTimestampToLocalDateTime } from './DatetimeUtils';
import { useData } from './DataContext';
import Loader from './Loader'
import "./../css/DisplayDeployed.css";

const APIURL = "https://api.studio.thegraph.com/query/42170/voting-system-api/v0.0.3";
const query = `
query {
    deployedContracts(last: 10, orderBy: blockTimestamp, orderDirection:desc) {
      id
      contractAddress
      blockNumber
      blockTimestamp
    }
  }
`;
const client = createClient({ url: APIURL });


function DisplayDeployedContracts() {
  const [loading, setLoading] = useState(false);
  const [deployedContracts, setDeployedContracts] = useState([]);
  const { refetchFlag } = useData();
  const containerRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, [refetchFlag]);

  async function fetchData() {
    let reloadFlag = false
    if(deployedContracts.length > 0){
      reloadFlag = true
    }
    setLoading(true);
    const response = await client.query(query).toPromise();
    setDeployedContracts(await response.data.deployedContracts);
    setLoading(false);
    if(reloadFlag){
      window.location.href = '/';
    }
  }

  function getUrl(addr) {
    const path = `/contract/${addr}`;
    return path;
  }

  if (loading) {
    return <Loader />;
  }

  return (<>
    {loading && <Loader />}
    <div ref={containerRef} className='display-deployed-contracts'>
      {deployedContracts.map((contract, index) => (
        <div key={index} className='elections-form'>
          <br />
          <h4>id: {contract.id}</h4>
          <h4>
            addr: <Link to={getUrl(contract.contractAddress)}>{contract.contractAddress}</Link>
          </h4>
          <h4>block: {contract.blockNumber}</h4>
          <h4>time: {convertTimestampToLocalDateTime(contract.blockTimestamp)}</h4>
          <div className='button-container'>
            <button
              className='see-more-btn'
              onClick={() => window.location.href = getUrl(contract.contractAddress)}>
              See more
            </button>
          </div>
        </div>
      ))}
    </div></>
  );
}

export default DisplayDeployedContracts;
