import React from 'react'
import { createClient } from 'urql';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { convertTimestampToLocalDateTime } from './DatetimeUtils';

import "./../css/DisplayDeployed.css";

const APIURL = "https://api.studio.thegraph.com/query/42170/voting-system-api/v0.0.3";
const query = `
query{
  deployedContracts(last: 10) {
    id
    contractAddress
    blockNumber
    blockTimestamp
  }
}
`
const client = createClient({
    url: APIURL,
});


function DisplayDeployedContracts() {
    const [deployedContracts, setDeployedContracts] = useState([]);

    useEffect(() => {
        fetchData();
    }, [])

    if (deployedContracts === null) {
        return <div>Loading...</div>
    }

    async function fetchData() {
        const response = await client.query(query).toPromise();
        const sortedContracts = response.data.deployedContracts.sort((a, b) => b.blockTimestamp - a.blockTimestamp);
        setDeployedContracts(sortedContracts);
    }

    function getUrl(addr) {
        const path = `/contract/${addr}`;
        return path;
    }
    
    return (
        <div className='display-deployed-contracts'>
            {deployedContracts.map((contract, index) => (
                <div key={index}>
                    <br />
                    <h4 className='contract-property'>id: {contract.id}</h4>
                    <h4>addr: <Link to={getUrl(contract.contractAddress)} className='contract-property'> {contract.contractAddress}</Link></h4>
                    <h4 className='contract-property'>block: {contract.blockNumber}</h4>
                    <h4 className='contract-property'>time: {convertTimestampToLocalDateTime(contract.blockTimestamp)}</h4>
                </div>
            ))}
        </div>
    )
}

export default DisplayDeployedContracts;
