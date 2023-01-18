const { expect } = require('chai');
const { ethers } = require('hardhat');
const Vote = require('../artifacts/contracts/Vote.sol/Vote.json');

describe('Vote contract', () => {

    let provider;
    let wallet;
    let vote;

    beforeEach(async () => {
        contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
        provider = new ethers.providers.JsonRpcProvider();
        [owner] = await ethers.getSigners();
        vote = await ethers.getContractFactory("Vote");
        // vote = await VoteContractFactory.deploy(owner.address, contractAddress);
    });

    it('should initialize the contract with the correct number of choices and end timestamp', async () => {
        const contract = await vote.deploy(3, 5);
        const choices = await contract.choices();
        const endTimestamp = await contract.endTimestamp();
        expect(choices).to.equal(3);
        expect(endTimestamp).to.be.closeTo(Math.floor(Date.now() / 1000) + (5 * 86400), 2);
    });

    it('should only allow voting before end timestamp', async () => {
        const contract = await vote.deploy(3, 0);
        await expect(contract.vote(1)).to.be.rejected;
    });

    it('should only allow voting with valid choice ids', async () => {
        const contract = await vote.deploy(3, 5);
        await expect(contract.vote(0)).to.be.rejected;
        await expect(contract.vote(4)).to.be.rejected;
    });

    it('should only allow one vote per address', async () => {
        const contract = await vote.deploy(3, 5);
        await contract.vote(1);
        await expect(contract.vote(2)).to.be.rejected;
    });

    it('should not allow reading votes before end timestamp', async () => {
        const contract = await vote.deploy(3, 0);
        await expect(contract.readVoteById(1)).to.be.rejected;
    });

    it('should not allow reading votes with invalid choice ids', async () => {
        const contract = await vote.deploy(3, 5);
        await expect(contract.readVoteById(0)).to.be.rejected;
        await expect(contract.readVoteById(4)).to.be.rejected;
    });

    // it('should not accept payments', async () =>{
    //     const contract = await vote.deploy(3, 5);
    //     expect (await owner.transfer(contract.address, 10)).to.be.revertedWith("Error: receive function cannot be called.");
    // } )
    
     it('should invoke the receive function', async () => {
        const contract = await vote.deploy(3, 5);
        const tx = owner.sendTransaction({
            to: contract.address,
            value: ethers.utils.parseEther("1") // 1 ether
        });
        await expect(tx).to.be.revertedWith("Error: receive function cannot be called.");
        
    });
    
    it('should invoke the fallback function', async () => {
        const contract = await vote.deploy(3, 5);
        const nonExistentFuncSignature = 'nonExistentFunction(uint256,uint256)';
        const fakeContract = new ethers.Contract(
            contract.address,
            [
                ...contract.interface.fragments,
                `function ${nonExistentFuncSignature}`,
            ],
            owner,
        );
        const tx = fakeContract[nonExistentFuncSignature](8, 4);
        await expect(tx).to.be.revertedWith("Error: fallback function cannot be called.");
    });
    

});
