/* eslint-disable no-bitwise */

/**
 * This function generates the signature of a Poll Joining Verifying Key (VK).
 * This can be used to check if a PollJoining' circuit VK is registered
 * in a smart contract that holds several VKs.
 * @param stateTreeDepth - The depth of the state tree.
 * @param voteOptionTreeDepth - The depth of the vote option tree.
 * @returns Returns a signature for querying if a verifying key with the given parameters is already registered in the contract.
 */
export const genPollJoiningVkSig = (stateTreeDepth: number, voteOptionTreeDepth: number): bigint =>
  (BigInt(stateTreeDepth) << 64n) + BigInt(voteOptionTreeDepth);

/**
 * This function generates the signature of a Poll Joined Verifying Key (VK).
 * This can be used to check if a PollJoined' circuit VK is registered
 * in a smart contract that holds several VKs.
 * @param stateTreeDepth - The depth of the state tree.
 * @param voteOptionTreeDepth - The depth of the vote option tree.
 * @returns Returns a signature for querying if a verifying key with the given parameters is already registered in the contract.
 */
export const genPollJoinedVkSig = (stateTreeDepth: number, voteOptionTreeDepth: number): bigint =>
  (BigInt(stateTreeDepth) << 128n) + (BigInt(voteOptionTreeDepth) << 64n);

/**
 * This function generates the signature of a ProcessMessage Verifying Key(VK).
 * This can be used to check if a ProcessMessages' circuit VK is registered
 * in a smart contract that holds several VKs.
 * @param stateTreeDepth - The depth of the state tree.
 * @param voteOptionTreeDepth - The depth of the vote option tree.
 * @param batchSize - The size of the batch.
 * @returns Returns a signature for querying if a verifying key with the given parameters is already registered in the contract.
 */
export const genProcessVkSig = (stateTreeDepth: number, voteOptionTreeDepth: number, batchSize: number): bigint =>
  (BigInt(batchSize) << 128n) + (BigInt(stateTreeDepth) << 64n) + BigInt(voteOptionTreeDepth);

/**
 * This function generates the signature of a Tally Verifying Key(VK).
 * This can be used to check if a TallyVotes' circuit VK is registered
 * in a smart contract that holds several VKs.
 * @param _stateTreeDepth - The depth of the state tree.
 * @param _intStateTreeDepth - The depth of the intermediate state tree.
 * @param _voteOptionTreeDepth - The depth of the vote option tree.
 * @returns Returns a signature for querying if a verifying key with
 * the given parameters is already registered in the contract.
 */
export const genTallyVkSig = (
  _stateTreeDepth: number,
  _intStateTreeDepth: number,
  _voteOptionTreeDepth: number,
): bigint => (BigInt(_stateTreeDepth) << 128n) + (BigInt(_intStateTreeDepth) << 64n) + BigInt(_voteOptionTreeDepth);
