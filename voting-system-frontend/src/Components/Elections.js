import React from 'react';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Vote from "../ABI/Vote.json";
import { convertTimestampToLocalDateTime, timestampBeforeNow } from './DatetimeUtils';


function Elections() {
    const [provider, setProvider] = useState(null);
    const [endTimestamp, setEndTimestamp] = useState("");
    const [electionsContract, setElectionsContract] = useState([]);
    const [choices, setChoices] = useState([]);
    const [voteResults, setVoteResults] = useState([]);
    const { addr } = useParams()


    useEffect(() => {
        fetchElections()
    }, [])
    useEffect(() => {
        countChoices()
    }, [])
    useEffect(() => {
        getVoteResults()
    }, [])


    async function fetchElections() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(addr, Vote.abi, signer);
        setEndTimestamp(await contract.endTimestamp());
        setElectionsContract(contract);

        return contract;
    }

    async function vote(choice) {
        const contract = await fetchElections();
        let tx = await contract.vote(choice);
        alert("Voted successfully!");
    }

    async function countChoices() {
        const choices = [];
        const contract = await fetchElections();
        for (let i = 1; i <= await contract.choices(); i++) {
            choices.push(i);
        }
        setChoices(choices)
        return choices;
    }

    async function getVoteResults() {
        const results = [];
        for (let i = 1; i <= choices.length; i++) {
            results.push(await readVoteById(i));
        }
        setVoteResults(results);
    }

    async function readVoteById(choice) {
        const contract = await fetchElections();
        let tx = await contract.readVoteById(choice);
        return tx;
    }


    return (
        <div className='display-deployed-contracts'>
            <br /><br /><br /><br /><br /><br />
            <h4 className='contract-property'>Selected contract Id: {addr}</h4>
            <h4> Vote end: {convertTimestampToLocalDateTime(endTimestamp)}</h4>
            {(!timestampBeforeNow(endTimestamp)) &&
                <form>
                    <input id={"choice-id"} placeholder={"Choice Id"} /><br />

                    <button type="button" onClick={async () => {
                        const choice = document.getElementById("choice-id").value;
                        await vote(choice);
                    }}>
                        VOTE
                    </button>
                </form>}
            {(timestampBeforeNow(endTimestamp)) &&
                
                <button type="button" onClick={async () => { 
                    await countChoices();
                    await getVoteResults();  
                }}>
                    Results
                </button>}
                {   voteResults.length > 0 &&
                    <div>
                    <h4 className='contract-property'>Vote Results:</h4>    
                    {choices.map((choice, index) => (
                        <div key={index}>
                            <br />
                            <h4 className='contract-property'>Choice {choice} </h4>
                            <h4 className='contract-property'>votes: { voteResults[choice-1]}</h4>
                        </div>
                    ))}
                    </div>
                }
        </div>
    )
}

export default Elections;
