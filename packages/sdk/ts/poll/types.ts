import type { BigNumberish, Provider, Signer } from "ethers";

/**
 * Interface for the arguments to the get poll command
 */
export interface IGetPollArgs {
  /**
   * A signer object
   */
  signer?: Signer;

  /**
   * A provider fallback object
   */
  provider?: Provider;

  /**
   * The address of the MACI contract
   */
  maciAddress: string;

  /**
   * The poll id. If not specified, latest poll id will be used
   */
  pollId?: BigNumberish;
}

/**
 * Interface for the return data to the get poll command
 */
export interface IGetPollData {
  /**
   * The poll id
   */
  id: BigNumberish;

  /**
   * The poll address
   */
  address: string;

  /**
   * The poll deployment time
   */
  deployTime: BigNumberish;

  /**
   * The poll duration
   */
  duration: BigNumberish;

  /**
   * The poll number of signups
   */
  numSignups: BigNumberish;

  /**
   * Whether the MACI contract's state root has been merged
   */
  isMerged: boolean;

  /**
   * Mode of the poll
   */
  mode: BigNumberish;
}

/**
 * Arguments for the get poll params command
 */
export interface IGetPollParamsArgs {
  /**
   * The poll id
   */
  pollId: bigint;
  /**
   * The signer
   */
  signer: Signer;
  /**
   * The MACI contract address
   */
  maciContractAddress: string;
}

/**
 * Poll parameters
 */
export interface IPollParams {
  /**
   * The message batch size
   */
  messageBatchSize: number;
  /**
   * The number of vote options
   */
  numVoteOptions: number;

  /**
   * Tally Batch Size
   */
  tallyBatchSize: number;

  /**
   * The vote option tree depth
   */
  voteOptionTreeDepth: number;

  /**
   * The depth of the tree holding the user ballots
   */
  intStateTreeDepth: number;
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
}
