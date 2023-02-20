//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
pragma abicoder v2;

import "./Vote.sol";

contract VoteDeployer {    
    mapping(address => address[]) public contractsAddressList; 

    Vote public vote; 
    event DeployedContract(address _contractAddress);

    function deployVote(uint8 _choices, uint8 _daysAfter) public {
        vote = new Vote(_choices, _daysAfter);
        contractsAddressList[msg.sender].push(address(vote));
        emit DeployedContract(address(vote));
    }

    receive() external payable {
        revert("Error: receive function cannot be called.");
    }
      
    fallback() external payable {
        revert("Error: fallback function cannot be called.");
    }
}