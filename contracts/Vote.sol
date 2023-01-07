//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
pragma abicoder v2;

contract Vote {    
    uint8 public choices;
    uint public endTimestamp; 

    event Winner(uint8);

    // Mapping of voter address to voted choice
    // Voting choices ids start from 1
    mapping(address => uint8) public voterChoices;

    //Mapping of choice id to number of votes for it
    mapping(uint8 => uint24) public votes;

    constructor(uint8 _choices, uint daysAfter){
        choices = _choices;
        endTimestamp = block.timestamp + daysAfter * 1 days;
    }

    function vote(uint8 _choiceId) public {
        require((_choiceId > 0) && (_choiceId <= choices), "Invalid choice");
        require(voterChoices[msg.sender] == 0, "You have already voted");
        require(block.timestamp < endTimestamp, "Voting has closed");
        voterChoices[msg.sender] = _choiceId;
        votes[_choiceId] += 1;
    }

    receive() external payable {
        revert("Error: receive function cannot be called.");
    }
      
    fallback() external payable {
        revert("Error: fallback function cannot be called.");
    }
}