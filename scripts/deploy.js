const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const VoteDeployer = await hre.ethers.getContractFactory("VoteDeployer");
  const voteDeployer = await VoteDeployer.deploy();

  await voteDeployer.deployed();

  console.log(
    `VoteDeployer contract deployed successfully to ${voteDeployer.address}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
