import React from 'react';
import { useState } from 'react';
import "../css/Header.css";

function Header() {
    const [walletAddress, setWalletAddress] = useState("");

    async function requestAccount() {
        console.log("Requesting account...");
        if (window.ethereum) {
            console.log("detected");
        } else {
            console.log("MetaMask not detected")
        }
        try {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            console.log(accounts[0]);
            alert(`Connected wallet with address: ${accounts[0]}`);
            return accounts[0];
        } catch (error) {
            console.log("Error connecting...")
            return "Error connecting"
        }
    }

    async function connectWallet() {
        if (typeof window.ethereum !== 'undefined') {
            await requestAccount()
                .then((address) => {
                    setWalletAddress(address);
                });
        }
    }
  
    return (
    <header>
        <h1>Voting System</h1>
        <button type="button" onClick={connectWallet} className='connect-wallet'>
            Connect wallet
        </button>
    </header>
  )
}

export default Header