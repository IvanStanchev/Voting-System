# Voting-System

## Usage
### Prerequisite
Install the dependencies
```sh
npm install
```

### Help
Show available tasks and options
```sh
npx hardhat help
```

### Compile
Compile the smart contracts with hardhat
```sh
npx hardhat node
```

### Test
Run the tests
```sh
npx hardhat test
```

### Coverage
Run the tests and show code coverage 
```sh
npx hardhat coverage
```

### Local network
Run local hardhat network
```sh
npx hardhat node
```

### Deploy
Deploy [`VoteDeployer`](/contracts/VoteDeployer.sol) contract 
- requires Private key and Infura API key
```sh
npx hardhat --network localhost run scripts/deploy.js
```

### Verify
Verify a smart contract with etherscan 
- requires etherscan API key
```sh
npx hardhat verify --network <network> <DEPLOYED_CONTRACT_ADDRESS> 'constructor arg 1' 'constructor arg 2'
```
## Contacts

| Contacts              |                                                                        |
| ---------------------------------------------- | --------------------------------------------- |
| Email                 | ivan.r.stanchev.2018@elsys-bg.org                                      |
| LinkedIn              | [Ivan Stanchev](https://www.linkedin.com/in/ivan-stanchev-6746b317b/)  |



## License

MIT
