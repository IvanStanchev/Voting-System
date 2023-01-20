//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
pragma abicoder v2;

import "./Vote.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ElectionsDeployer is Ownable {    
    Vote vote;
    Vote[] public electionsList; 

    event Results(uint24[] results);

    function deploy(uint8 _choices, uint daysAfter) public {
        vote = new Vote(_choices, daysAfter);
        electionsList.push(vote);
    }

    receive() external payable {
        revert("Error: receive function cannot be called.");
    }
      
    fallback() external payable {
        revert("Error: fallback function cannot be called.");
    }
}