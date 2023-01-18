const ethers = require("hardhat").ethers;

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
  const endTimestamp = currentTimestampInSeconds + ONE_YEAR_IN_SECS;

  const Vote = await ethers.getContractFactory("Vote");
  const vote = await Vote.deploy(3, endTimestamp);

  await vote.deployed();

  console.log(`Vote contract with 3 choices and end timestamp ${endTimestamp} deployed to ${vote.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
