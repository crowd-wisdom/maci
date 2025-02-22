// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import { Params } from "./utilities/Params.sol";
import { DomainObjs } from "./utilities/DomainObjs.sol";
import { MessageProcessor } from "./MessageProcessor.sol";
import { IMessageProcessorFactory } from "./interfaces/IMPFactory.sol";

/// @title MessageProcessorFactory
/// @notice A factory contract which deploys MessageProcessor contracts.
contract MessageProcessorFactory is Params, DomainObjs, IMessageProcessorFactory {
  /// @inheritdoc IMessageProcessorFactory
  function deploy(
    address _verifier,
    address _vkRegistry,
    address _poll,
    address _owner,
    Mode _mode
  ) public returns (address messageProcessorAddr) {
    // deploy MessageProcessor for this Poll
    MessageProcessor messageProcessor = new MessageProcessor(_verifier, _vkRegistry, _poll, _owner, _mode);
    messageProcessorAddr = address(messageProcessor);
  }
}
