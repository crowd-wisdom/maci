// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { ISemaphore } from "../interfaces/ISemaphore.sol";

/// @title MockSemaphore
/// @notice A mock contract to test the Semaphore gatekeeper
contract MockSemaphoreMultiGroup is ISemaphore {
  /// @notice The groups ids of semaphore
  mapping(uint256 => uint256) public groupIds;

  bool public valid = true;

  /// @notice Create a new instance
  /// @param _groupId The group id
  constructor(uint256 _groupId) {
    groupIds[_groupId] = _groupId;
  }

  /// @notice mock function to flip the valid state
  function flipValid() external {
    valid = !valid;
  }

  /// @notice Verify a proof for the group
  function verifyProof(uint256 _groupId, SemaphoreProof calldata proof) external view returns (bool) {
    return valid;
  }

  /// @notice Set groupId from Semaphore Groups
  /// @param _groupId The group id of the semaphore group
  function setSemaphoreGroups(uint256 _groupId) public {
    groupIds[_groupId] = _groupId;
  }
}
