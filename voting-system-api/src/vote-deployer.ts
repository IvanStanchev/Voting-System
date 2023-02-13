import { DeployedContract as DeployedContractEvent } from "../generated/VoteDeployer/VoteDeployer"
import { DeployedContract } from "../generated/schema"

export function handleDeployedContract(event: DeployedContractEvent): void {
  let entity = new DeployedContract(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.contractAddress = event.params.contractAddress

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
