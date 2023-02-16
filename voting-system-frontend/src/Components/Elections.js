import React from 'react';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Vote from "../ABI/Vote.json";
import { convertTimestampToLocalDateTime } from './DatetimeUtils';


function Elections() {
    const [provider, setProvider] = useState(null);
    const [endTimestamp, setEndTimestamp] = useState("");
    const { addr } = useParams()


    useEffect(() => {
        fetchElections()
    })


    async function fetchElections() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(addr, Vote.abi, signer);
        setEndTimestamp(await contract.endTimestamp());

        return contract;
    }

    async function vote(choice) {
        const contract = await fetchElections();
        let tx = await contract.vote(choice);
        await tx.wait();
        alert("Voted successfully!");
    }

    
    return (   
        <div className='display-deployed-contracts'>
            <br /><br /><br /><br /><br /><br />    
            <h4 className='contract-property'>Selected contract Id: {addr}</h4>
            <h4> Vote ends in { convertTimestampToLocalDateTime(endTimestamp) }</h4>
            <form>
                <input id={"choice-id"} placeholder={"Choice Id"} /><br />
                
                <button type="button" onClick={async () => {
                        const choice = document.getElementById("choice-id").value;
                        console.log(choice);
                        await vote(choice);}}>
                            VOTE
                </button>
            </form>
        </div>
    )
}

export default Elections;
