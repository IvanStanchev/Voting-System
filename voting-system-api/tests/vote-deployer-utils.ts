import { newMockEvent } from "matchstick-as"
import { ethereum, Address } from "@graphprotocol/graph-ts"
import { DeployedContract } from "../generated/VoteDeployer/VoteDeployer"

export function createDeployedContractEvent(
  contractAddress: Address
): DeployedContract {
  let deployedContractEvent = changetype<DeployedContract>(newMockEvent())

  deployedContractEvent.parameters = new Array()

  deployedContractEvent.parameters.push(
    new ethereum.EventParam(
      "contractAddress",
      ethereum.Value.fromAddress(contractAddress)
    )
  )

  return deployedContractEvent
}
