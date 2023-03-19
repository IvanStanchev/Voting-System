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
            <a className="title" href="/" target="_blank">
                <h1>Voting System</h1>
            </a>
            
            {!walletAddress && (
                <button type="button" onClick={connectWallet} className='connect-wallet'>
                Connect wallet
                </button>
            )}
            {walletAddress && (
                <h3>{walletAddress}</h3>

            )}
        </header>
    )
}

export default Header