//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;
pragma abicoder v2;

contract Vote {    
    uint8 public choices;

    event Results(mapping(uint8 => uint24) votes);

    mapping(address => bool) public voters; // voters addresses and voting status 
    mapping(uint8 => uint24) public votes; // votes for each party/politician

    constructor(uint8 _choices){
        choices = _choices;
    }

    function vote(uint8 _choiceId) public {
        require(voters(msg.sender) == false, "You have already voted");
        voters[msg.sender] = true;
        votes[_choiceId] += 1;
    }

    function() external payable {
        require(msg.sender.send(msg.value), "Transaction failed");
    }


}