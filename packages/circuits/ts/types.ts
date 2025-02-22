import type { CircuitConfig } from "circomkit";

export type BigNumberish = number | string | bigint;

/**
 * Interface that represents Verification key
 */
export interface ISnarkJSVerificationKey {
  protocol: BigNumberish;
  curve: BigNumberish;
  nPublic: BigNumberish;
  vk_alpha_1: BigNumberish[];
  vk_beta_2: BigNumberish[][];
  vk_gamma_2: BigNumberish[][];
  vk_delta_2: BigNumberish[][];
  vk_alphabeta_12: BigNumberish[][][];
  IC: BigNumberish[][];
}

/**
 * Inputs for circuit PollJoining
 */
export interface IPollJoiningInputs {
  privKey: bigint;
  pollPubKey: bigint[][];
  stateLeaf: bigint[];
  siblings: bigint[][];
  indices: bigint[];
  nullifier: bigint;
  credits: bigint;
  stateRoot: bigint;
  actualStateTreeDepth: bigint;
  pollId: bigint;
}

/**
 * Inputs for circuit PollJoined
 */
export interface IPollJoinedInputs {
  privKey: bigint;
  voiceCreditsBalance: bigint;
  joinTimestamp: bigint;
  stateLeaf: bigint[];
  pathElements: bigint[][];
  pathIndices: bigint[];
  credits: bigint;
  stateRoot: bigint;
  actualStateTreeDepth: bigint;
}

/**
 * Inputs for circuit ProcessMessages
 */
export interface IProcessMessagesInputs {
  actualStateTreeDepth: bigint;
  numSignUps: bigint;
  batchEndIndex: bigint;
  index: bigint;
  inputBatchHash: bigint;
  outputBatchHash: bigint;
  msgs: bigint[];
  coordPrivKey: bigint;
  coordinatorPublicKeyHash: bigint;
  encPubKeys: bigint[];
  currentStateRoot: bigint;
  currentStateLeaves: bigint[];
  currentStateLeavesPathElements: bigint[][];
  currentSbCommitment: bigint;
  currentSbSalt: bigint;
  newSbCommitment: bigint;
  newSbSalt: bigint;
  currentBallotRoot: bigint;
  currentBallots: bigint[];
  currentBallotsPathElements: bigint[][];
  currentVoteWeights: bigint[];
  currentVoteWeightsPathElements: bigint[][];
}

/**
 * Inputs for circuit TallyVotes
 */
export interface ITallyVotesInputs {
  stateRoot: bigint;
  ballotRoot: bigint;
  sbSalt: bigint;
  index: bigint;
  numSignUps: bigint;
  sbCommitment: bigint;
  currentTallyCommitment: bigint;
  newTallyCommitment: bigint;
  ballots: bigint[];
  ballotPathElements: bigint[];
  votes: bigint[][];
  currentResults: bigint[];
  currentResultsRootSalt: bigint;
  currentSpentVoiceCreditSubtotal: bigint;
  currentSpentVoiceCreditSubtotalSalt: bigint;
  currentPerVOSpentVoiceCredits: bigint[];
  currentPerVOSpentVoiceCreditsRootSalt: bigint;
  newResultsRootSalt: bigint;
  newPerVOSpentVoiceCreditsRootSalt: bigint;
  newSpentVoiceCreditSubtotalSalt: bigint;
}

/**
 * Extend CircuitConfig type to include the name of the circuit
 */
export interface CircuitConfigWithName extends CircuitConfig {
  name: string;
}
