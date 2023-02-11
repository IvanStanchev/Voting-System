const { expect } = require('chai');
const { ethers } = require('hardhat');
const { time } = require('@nomicfoundation/hardhat-network-helpers');


const Vote = require('../artifacts/contracts/Vote.sol/Vote.json');

describe('Vote contract', () => {

    let provider;
    let wallet;
    let vote;

    beforeEach(async () => {
        contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
        provider = new ethers.providers.JsonRpcProvider();
        [owner, addr1, addr2] = await ethers.getSigners();
        vote = await ethers.getContractFactory("Vote");
    });

    it('should initialize the contract with the correct number of choices and end timestamp', async () => {
        const contract = await vote.deploy(3, 5);
        const choices = await contract.choices();
        const endTimestamp = await contract.endTimestamp();
        expect(choices).to.equal(3);
        expect(endTimestamp).to.be.closeTo(Math.floor(Date.now() / 1000) + (5 * 86400), 15);
    });

    describe('vote', () => { 
        it('should not allow voting after end timestamp', async () => {
            const contract = await vote.deploy(3, 0);
            await expect(contract.vote(1)).to.be.rejected;
        });

        it('should only allow voting once', async() => {
            const contract = await vote.deploy(3, 5);
            await contract.vote(1);
            await expect(contract.vote(1)).to.be.rejectedWith('You have already voted');
        })

        it('should not allow voting with invalid choice ids', async () => {
            const contract = await vote.deploy(3, 5);
            await expect(contract.vote(0)).to.be.rejected;
            await expect(contract.vote(4)).to.be.rejected;
        });

        it('should only allow one vote per address', async () => {
            const contract = await vote.deploy(3, 5);
            await contract.vote(1);
            await expect(contract.vote(2)).to.be.rejected;
        });
    });

    describe('readVoteById', () => {
        it('should not allow reading votes before end timestamp', async () => {
            const contract = await vote.deploy(3, 0);
            await expect(contract.readVoteById(1)).to.be.rejected;
        });

        it('should not allow reading votes with invalid choice ids', async () => {
            const contract = await vote.deploy(3, 5);
            await expect(contract.readVoteById(0)).to.be.rejected;
            await expect(contract.readVoteById(4)).to.be.rejected;
        });

        it('should return the correct number of votes after voting period has ended', async () => {
            const contract = await vote.deploy(5, 1);
            await contract.vote(2); 
            await time.increase(time.duration.days(2));
            
            let result = await contract.readVoteById(2);
            expect(result).to.equal(1);
        });

        it('should allow everyone to read vote after voting period has ended', async() => {
            const contract = await vote.deploy(3, 2);
            await contract.vote(3);
            await time.increase(time.duration.days(3));
            let result = await contract.connect(addr1).readVoteById(3);
            expect (result).to.equal(1);
        });
    });

    describe('readAllVote', ()=> {
        it('should return all votes when readAllVote is called after voting period has ended', async() => {
            const contract = await vote.deploy(3, 3);
            await contract.vote(1);
            await contract.connect(addr1).vote(2);
            await contract.connect(addr2).vote(2);

            await time.increase(time.duration.days(10));
            let results = await contract.readAllVote();
            expect(results).to.emit([1,2,0]);        
        });

        it('should not allow reading votes before voting period has ended', async() => {
            const contract = await vote.deploy(3, 4);
            await contract.vote(1);
            await contract.connect(addr1).vote(2);
            await contract.connect(addr2).vote(2);
            
            let results = contract.readAllVote();
            await expect(results).to.be.revertedWith('Voting has not ended');
        });

        it('should allow everyone to call readAllVote after voting period has ended', async() => {
            const contract = await vote.deploy(3, 3);
            await contract.vote(1);
            await contract.connect(addr1).vote(2);
            await contract.connect(addr2).vote(2);
            await time.increase(time.duration.days(10));

            let resultsArr = [];
            resultsArr[0] = await contract.readAllVote;
            resultsArr[1] = await contract.connect(addr1).readAllVote;
            resultsArr[2] = await contract.connect(addr2).readAllVote;

            resultsArr.forEach(results => {
                expect(results).to.emit([1,2,0]);        
            });            
        });

    });
        
    describe('receive', ()=> {
        it('should invoke the receive function when tokens are sent', async () => {
            const contract = await vote.deploy(3, 5);
            const tx = owner.sendTransaction({
                to: contract.address,
                value: ethers.utils.parseEther('1')
            });
            await expect(tx).to.be.revertedWith('Error: receive function cannot be called.');
        });
    });

    describe('fallback', ()=> {
        it('should invoke the fallback function when calling a nonexistent method', async () => {
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
            await expect(tx).to.be.revertedWith('Error: fallback function cannot be called.');
        });

        it('should not be able to call fallback', async() => {
            const contract = await vote.deploy(3, 4);
            expect (contract.fallback()).to.be.revertedWith('Error: fallback function cannot be called.');
        });
    });
});
  