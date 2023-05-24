import React from 'react';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Vote from "../ABI/Vote.json";
import { convertTimestampToLocalDateTime, timestampBeforeNow } from './DatetimeUtils';
import Loader from './Loader';
import "../css/Elections.css"


function Elections() {
    const [provider, setProvider] = useState(null);
    const [endTimestamp, setEndTimestamp] = useState("");
    const [electionsContract, setElectionsContract] = useState([]);
    const [choices, setChoices] = useState([]);
    const[ voterChoice, setVoteChoice ] = useState("")
    const [voteResults, setVoteResults] = useState([]);
    const [loading, setLoading] = useState(false)
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
        await contract.vote(choice);
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
        <div>
            <br /><br /><br /><br /><br /><br />
            <form className='contract-property'>
                <h4 >Selected contract Id: {addr}</h4>
                <h4> Vote end: {convertTimestampToLocalDateTime(endTimestamp)}</h4>

                <form className="button-container">
                {(!timestampBeforeNow(endTimestamp)) &&
                    <>
                        <input className="choice-id-input" 
                            id={"choice-id"} 
                            placeholder={"Choice Id"} /><br />
                        
                        <button className="vote-btn" type="button" onClick={async () => {
                            const choice = document.getElementById("choice-id").value;
                            setLoading(true)
                            try {
                                await vote(choice);
                              } catch (error) {
                                if (error.message.includes("execution reverted: You have already voted")) {
                                  const errorContainer = document.getElementById("error-container");
                                  errorContainer.textContent = "You have already voted. Cannot vote again.";
                                } else if (error.message.includes("execution reverted: Invalid choice")) {
                                    const errorContainer = document.getElementById("error-container");
                                    errorContainer.textContent = "You have entered an invalid choice. Try again.";
                                  }
                              }
                            setLoading(false)
                            choice.value = ""
                        }}>
                            VOTE
                        </button>
                        <div id="error-container"></div>

                        {loading && <Loader/>}
                    </>
                    }
                {(timestampBeforeNow(endTimestamp)) &&
                <>
                    <button className="results-btn"
                        type="button" onClick={async () => {
                            setLoading(true)
                            await countChoices();
                            await getVoteResults();
                            setLoading(false)
                        }}>
                        Results
                    </button>
                    {loading && <Loader/>}
                </>}
                </form>
                {voteResults.length > 0 &&
                    <div>
                        <h4 >Vote Results:</h4>
                        <div className='results'>
                        {choices.map((choice, index) => (
                            <div className='vote-result' key={index}>
                                <h4 >Choice {choice} </h4>
                                <h4 >votes: {voteResults[choice - 1]}</h4>
                            </div>
                        ))}
                        </div>
                    </div>
                }
            </form>
        </div>
    )
}

export default Elections;
