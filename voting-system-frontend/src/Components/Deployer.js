import React from 'react'
import { ethers } from 'ethers';
import { useState } from 'react';
import VoteDeployer from "../ABI/VoteDeployer.json";
import './../css/Deployer.css'

const VOTE_DEPLOYER_ADDRESS = "0xc64Bc354F8450aEC8765f29cE73d1e4790619F07";



function Deployer() {
    const [provider] = useState(null);

    async function deployVoteContract(choices, daysAfter) {
        let provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(VOTE_DEPLOYER_ADDRESS, VoteDeployer.abi, signer);
        let tx = await contract.deployVote(choices, daysAfter);
        await tx.wait();
        const vote_deployed = await contract.vote;
        console.log(vote_deployed.address);
    }

    return (
        <div>
            <main className='backapp'>
                <form>
                    <input id={"choices-count"} placeholder={"Choices count"} /><br />
                    <input id={"days-after"} placeholder={"To end in ... days"} /><br />
                    <button type="button" onClick={async () => {
                        const choices = document.getElementById("choices-count").value;
                        const daysAfter = document.getElementById("days-after").value;
                        console.log(choices, daysAfter)
                        const voteAddr = await deployVoteContract(choices, daysAfter);
                        console.log(`Deployed ${voteAddr}`);
                    }}>Add elections</button>
                </form>
                <hr />
            </main>
        </div>
    )
}

export default Deployer;