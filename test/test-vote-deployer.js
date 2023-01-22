const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Vote Deployer contract', () => {

    let provider;
    let voteDeployer;
    let tx;
    let deployer;

    beforeEach(async () => {
        provider = new ethers.providers.JsonRpcBatchProvider();
        [owner, addr1, addr2] = await ethers.getSigners();
        voteDeployer = await ethers.getContractFactory("VoteDeployer");
        deployer = await voteDeployer.deploy();
    })

    describe('contractAddressList', () => {
        it('should be able to read deployed contracts', async () => {
            await deployer.connect(addr1).deployVote(3, 3);
            await deployer.connect(addr1).deployVote(4, 4);
            await deployer.connect(addr2).deployVote(5, 5);
            
            const tx1 = deployer.contractsAddressList(addr1.address, 0);
            const tx2 = deployer.contractsAddressList(addr1.address, 1);
            const tx3 = deployer.contractsAddressList(addr2.address, 0);

            expect(await tx1).to.not.be.null;
            expect(await tx2).to.not.be.null;
            expect(await tx3).to.not.be.null;
        });

        it('should revert if it tries to read nonexistent contract from the list', async() => {
            const tx = deployer.contractsAddressList(addr1.address, 0);
            expect(tx).to.reverted;
        });
    })

    describe("deployVote", () => {
        it('should be able to deploy a Vote contract', async () => {
            let vote = await deployer.deployVote(3, 3);
            expect (vote).to.not.be.null;
        });
        
        it('should be able to deploy more than one Vote contracts', async () => {
            await deployer.deployVote(3, 3);
            let secondVote= await deployer.deployVote(4, 4);
            expect (secondVote).to.not.be.null;
        });
    });



    it('should invoke the receive function when tokens are sent', async () => {
        tx = owner.sendTransaction({
            to: deployer.address,
            value: ethers.utils.parseEther("1")
        });
        await expect(tx).to.be.revertedWith("Error: receive function cannot be called.");
        
    });
    describe("receive", () => {
        it('should invoke the fallback function when calling a nonexistent method', async () => {
            const nonExistentFuncSignature = 'nonExistentFunction(uint256,uint256)';
            const fakeContract = new ethers.Contract(
                deployer.address,
                [
                    ...deployer.interface.fragments,
                    `function ${nonExistentFuncSignature}`,
                ],
                owner,
            );
            const tx = fakeContract[nonExistentFuncSignature](8, 4);
            await expect(tx).to.be.revertedWith("Error: fallback function cannot be called.");
        });
    });
    
    describe('fallback', ()=> {
        it("should not allow the fallback function to be called", async () => {
            tx = deployer.fallback({value: 1});
            expect(tx).to.be.revertedWith("Error: fallback function cannot be called.");
        });
    });
    
});
    