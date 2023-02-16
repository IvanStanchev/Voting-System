// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class DeployedContract extends ethereum.Event {
  get params(): DeployedContract__Params {
    return new DeployedContract__Params(this);
  }
}

export class DeployedContract__Params {
  _event: DeployedContract;

  constructor(event: DeployedContract) {
    this._event = event;
  }

  get contractAddress(): Address {
    return this._event.parameters[0].value.toAddress();
  }
}

export class VoteDeployer extends ethereum.SmartContract {
  static bind(address: Address): VoteDeployer {
    return new VoteDeployer("VoteDeployer", address);
  }

  contractsAddressList(param0: Address, param1: BigInt): Address {
    let result = super.call(
      "contractsAddressList",
      "contractsAddressList(address,uint256):(address)",
      [
        ethereum.Value.fromAddress(param0),
        ethereum.Value.fromUnsignedBigInt(param1)
      ]
    );

    return result[0].toAddress();
  }

  try_contractsAddressList(
    param0: Address,
    param1: BigInt
  ): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "contractsAddressList",
      "contractsAddressList(address,uint256):(address)",
      [
        ethereum.Value.fromAddress(param0),
        ethereum.Value.fromUnsignedBigInt(param1)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  vote(): Address {
    let result = super.call("vote", "vote():(address)", []);

    return result[0].toAddress();
  }

  try_vote(): ethereum.CallResult<Address> {
    let result = super.tryCall("vote", "vote():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }
}

export class DefaultCall extends ethereum.Call {
  get inputs(): DefaultCall__Inputs {
    return new DefaultCall__Inputs(this);
  }

  get outputs(): DefaultCall__Outputs {
    return new DefaultCall__Outputs(this);
  }
}

export class DefaultCall__Inputs {
  _call: DefaultCall;

  constructor(call: DefaultCall) {
    this._call = call;
  }
}

export class DefaultCall__Outputs {
  _call: DefaultCall;

  constructor(call: DefaultCall) {
    this._call = call;
  }
}

export class DeployVoteCall extends ethereum.Call {
  get inputs(): DeployVoteCall__Inputs {
    return new DeployVoteCall__Inputs(this);
  }

  get outputs(): DeployVoteCall__Outputs {
    return new DeployVoteCall__Outputs(this);
  }
}

export class DeployVoteCall__Inputs {
  _call: DeployVoteCall;

  constructor(call: DeployVoteCall) {
    this._call = call;
  }

  get _choices(): i32 {
    return this._call.inputValues[0].value.toI32();
  }

  get daysAfter(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class DeployVoteCall__Outputs {
  _call: DeployVoteCall;

  constructor(call: DeployVoteCall) {
    this._call = call;
  }
}
