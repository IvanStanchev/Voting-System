import React, { useContext } from 'react';
import { useState } from 'react';
import DataContext from './DataContext';
import "../css/Header.css";

function Header() {
    const { sessionData, setSessionData } = useContext(DataContext)
    const [showTooltip, setShowTooltip] = useState(false);

    const handleMouseEnter = () => {
        setShowTooltip(true);
      };
    
      const handleMouseLeave = () => {
        setShowTooltip(false);
      };

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
                    setSessionData(address);
                });
        }
    }

    return (
        <header >
            <a className="title" href="/" target="_blank">
                <h1>Voting System</h1>
            </a>
            
            {!sessionData && (
                <button type="button" onClick={connectWallet} className='connect-wallet-btn'>
                Connect wallet
                </button>
            )}
            {sessionData && (
                <h3 className="tooltip" onClick={() => setSessionData()} 
                onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}> 
                    {sessionData}
                    <span className='tooltiptext'>Disconnect wallet</span>
                </h3>
            )}
        </header>
    )
}

export default Header