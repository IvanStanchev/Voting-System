import React, { createElement, useState } from 'react'
import { ethers } from 'ethers';
import VoteDeployer from "../ABI/VoteDeployer.json";
import { useData } from './DataContext'
import Loader from './Loader';
import './../css/Deployer.css'

const VOTE_DEPLOYER_ADDRESS = "0xc64Bc354F8450aEC8765f29cE73d1e4790619F07";


function Deployer() {
    const [choicesCount, setChoicesCount] = useState('');
    const [daysAfter, setDaysAfter] = useState('');
    const { toggleRefetchFlag } = useData();
    const [ loading, setLoading ] = useState( false );

   

    async function deployVoteContract(choices, daysAfter) {
        if(!choices || !daysAfter){
            throw new Error('Missing argument: choicesCount and daysAfter are required.');
        }
        if (isNaN(choices) || isNaN(choices)) {
            alert('Both inputs must be numbers.');
            throw new Error('Both inputs must be numbers.');
        }
        setLoading(true);
        let provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(VOTE_DEPLOYER_ADDRESS, VoteDeployer.abi, signer);
        let tx = await contract.deployVote(choices, daysAfter);
        await tx.wait();
        await contract.vote;
        console.log("deployVoteContract")
        setLoading(false);

    }

    function handleAddElectionsClick() {
        const choicesCount = document.getElementById("choices-count").value;
        const daysAfter = document.getElementById("days-after").value;        
        
        deployVoteContract(choicesCount, daysAfter)
          .then(() => {
            setChoicesCount('');
            setDaysAfter('');
            console.log(`refetching`);
            toggleRefetchFlag()
          })
          .catch((error) => {
            if (error.message.includes("user rejected transaction")) {
                alert("User rejected transaction");
                setLoading(false);
        }})
      }

    return (
        <div>
            <main className='backapp'>
                <form className='new-elections'>
                    <input 
                        className='new-elections-input' 
                        id={"choices-count"} 
                        placeholder={"Choices count"}
                        value={choicesCount}
                        onChange={(e) => setChoicesCount(e.target.value)}
                    />
                    <br />
                    <input 
                        className='new-elections-input' 
                        id={"days-after"} 
                        placeholder={"To end in ... days"}
                        value={daysAfter}
                        onChange={(e) => setDaysAfter(e.target.value)}
                    /><br />
                    <button className='add-elections-btn' type="button" onClick={handleAddElectionsClick}>Add elections</button>
                </form>
                <hr />
                {loading && <Loader/>}
            </main>
        </div>
    )
}

export default Deployer;