import { MACI, Poll } from "maci-contracts/typechain-types";
import { PubKey, PrivKey } from "maci-domainobjs";

import type { LeanIMT } from "@zk-kit/lean-imt";
import type { Provider, Signer } from "ethers";
import type { EMode } from "maci-contracts";
import type { IVkContractParams, Keypair, Message, VerifyingKey } from "maci-domainobjs";

/**
 * A circuit inputs for the circom circuit
 */
export type CircuitInputs = Record<string, string | bigint | bigint[] | bigint[][] | string[] | bigint[][][]>;

/**
 * Interface for the tally file data.
 */
export interface TallyData {
  /**
   * The MACI address.
   */
  maci: string;

  /**
   * The ID of the poll.
   */
  pollId: string;

  /**
   * The name of the network for which these proofs
   * are valid for
   */
  network?: string;

  /**
   * The chain ID for which these proofs are valid for
   */
  chainId?: string;

  /**
   * Whether the poll is using quadratic voting or not.
   */
  isQuadratic: boolean;

  /**
   * The address of the Tally contract.
   */
  tallyAddress: string;

  /**
   * The new tally commitment.
   */
  newTallyCommitment: string;

  /**
   * The results of the poll.
   */
  results: {
    /**
     * The tally of the results.
     */
    tally: string[];

    /**
     * The salt of the results.
     */
    salt: string;

    /**
     * The commitment of the results.
     */
    commitment: string;
  };

  /**
   * The total spent voice credits.
   */
  totalSpentVoiceCredits: {
    /**
     * The spent voice credits.
     */
    spent: string;

    /**
     * The salt of the spent voice credits.
     */
    salt: string;

    /**
     * The commitment of the spent voice credits.
     */
    commitment: string;
  };

  /**
   * The per VO spent voice credits.
   */
  perVOSpentVoiceCredits?: {
    /**
     * The tally of the per VO spent voice credits.
     */
    tally: string[];

    /**
     * The salt of the per VO spent voice credits.
     */
    salt: string;

    /**
     * The commitment of the per VO spent voice credits.
     */
    commitment: string;
  };
}

export type BigNumberish = number | string | bigint;
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
 * Interface for the arguments to the verifyProof command
 */
export interface VerifyArgs {
  /**
   * The id of the poll
   */
  pollId: bigint;

  /**
   * A signer object
   */
  signer: Signer;

  /**
   * The tally data
   */
  tallyData: TallyData;

  /**
   * The address of the MACI contract
   */
  maciAddress: string;

  /**
   * The tally commitments
   */
  tallyCommitments: ITallyCommitments;

  /**
   * The number of vote options
   */
  numVoteOptions: number;

  /**
   * The vote option tree depth
   */
  voteOptionTreeDepth: number;
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
 * Arguments for the generateTallyCommitments function
 */
export interface IGenerateTallyCommitmentsArgs {
  /**
   * The tally data
   */
  tallyData: TallyData;
  /**
   * The vote option tree depth
   */
  voteOptionTreeDepth: number;
}

/**
 * Interface for the tally commitments
 */
export interface ITallyCommitments {
  /**
   * The new tally commitment
   */
  newTallyCommitment: bigint;
  /**
   * The new spent voice credits commitment
   */
  newSpentVoiceCreditsCommitment: bigint;
  /**
   * The new per vote option spent voice credits commitment
   */
  newPerVOSpentVoiceCreditsCommitment?: bigint;
  /**
   * The commitment to the results tree root
   */
  newResultsCommitment: bigint;
}

/**
 * Interface for the arguments to the register check command
 */
export interface IRegisteredUserArgs {
  /**
   * A signer object
   */
  signer: Signer;

  /**
   * The public key of the user
   */
  maciPubKey: string;

  /**
   * The address of the MACI contract
   */
  maciAddress: string;

  /**
   * Start block for event parsing
   */
  startBlock?: number;
}

/**
 * Interface for the arguments to the parseSignupEvents function
 */
export interface IParseSignupEventsArgs {
  /**
   * The MACI contract
   */
  maciContract: MACI;

  /**
   * The start block
   */
  startBlock: number;

  /**
   * The current block
   */
  currentBlock: number;

  /**
   * The public key
   */
  publicKey: PubKey;
}

/**
 * Interface for the arguments to the signup command
 */
export interface ISignupArgs {
  /**
   * The public key of the user
   */
  maciPubKey: string;

  /**
   * A signer object
   */
  signer: Signer;

  /**
   * The address of the MACI contract
   */
  maciAddress: string;

  /**
   * The signup gatekeeper data
   */
  sgData: string;
}

/**
 * Interface for the return data to the signup command
 */
export interface ISignupData {
  /**
   * The state index of the user
   */
  stateIndex: string;

  /**
   * The signup transaction hash
   */
  transactionHash: string;
}

/**
 * Interface for the arguments to the parsePollJoinEvents function
 */
export interface IParsePollJoinEventsArgs {
  /**
   * The MACI contract
   */
  pollContract: Poll;

  /**
   * The start block
   */
  startBlock: number;

  /**
   * The current block
   */
  currentBlock: number;

  /**
   * The public key
   */
  pollPublicKey: PubKey;
}

/**
 * Interface for the arguments to the isJoinedUser command
 */
export interface IJoinedUserArgs {
  /**
   * The address of the MACI contract
   */
  maciAddress: string;

  /**
   * The id of the poll
   */
  pollId: bigint;

  /**
   * Poll public key for the poll
   */
  pollPubKey: string;

  /**
   * A signer object
   */
  signer: Signer;

  /**
   * The start block number
   */
  startBlock: number;
}

/**
 * Interface for the return data to the isRegisteredUser function
 */
export interface IIsRegisteredUser {
  /**
   * Whether the user is registered
   */
  isRegistered: boolean;
  /**
   * The state index of the user
   */
  stateIndex?: string;
}

/**
 * Interface for the return data to the isJoinedUser function
 */
export interface IIsJoinedUser {
  /**
   * Whether the user joined the poll
   */
  isJoined: boolean;
  /**
   * The state index of the user
   */
  pollStateIndex?: string;
  /**
   * The voice credits of the user
   */
  voiceCredits?: string;
}

/**
 * Arguments for the getAllVks function
 */
export interface GetAllVksArgs {
  /**
   * The address of the VkRegistry contract
   */
  vkRegistryAddress: string;
  /**
   * The signer to use for the contract calls
   */
  signer: Signer;
  /**
   * The depth of the state tree
   */
  stateTreeDepth: number;
  /**
   * The depth of the vote option tree
   */
  voteOptionTreeDepth: number;
  /**
   * The batch size for the process messages
   */
  messageBatchSize: number;
  /**
   * The depth of the ballot tree
   */
  intStateTreeDepth: number;
  /**
   * The mode to use for the contract calls
   */
  mode: EMode;
}

/**
 * MACI's verifying keys
 */
export interface IMaciVerifyingKeys {
  /**
   * The verifying key for the poll joining circuit
   */
  pollJoiningVkOnChain: IVkContractParams;
  /**
   * The verifying key for the poll joined circuit
   */
  pollJoinedVkOnChain: IVkContractParams;
  /**
   * The verifying key for the process messages circuit
   */
  processVkOnChain: IVkContractParams;
  /**
   * The verifying key for the tally votes circuit
   */
  tallyVkOnChain: IVkContractParams;
}

/**
 * Circuit parameters
 */
export interface ICircuitParams {
  /**
   * The state tree depth
   */
  stateTreeDepth: number;
  /**
   * The intermediate state tree depth (ballot tree)
   */
  intStateTreeDepth: number;
  /**
   * The vote option tree depth
   */
  voteOptionTreeDepth: number;
  /**
   * The message batch size
   */
  messageBatchSize: number;
}

/**
 * Maci verifying keys
 */
export interface IMaciVks {
  /**
   * The poll joining verifying key
   */
  pollJoiningVk?: VerifyingKey;
  /**
   * The poll joined verifying key
   */
  pollJoinedVk?: VerifyingKey;
  /**
   * The message processing verifying key
   */
  processVk?: VerifyingKey;
  /**
   * The tally verifying key
   */
  tallyVk?: VerifyingKey;
}

/**
 * Arguments for the extractAllVks function
 */
export interface IExtractAllVksArgs {
  /**
   * The path to the poll joining zkey
   */
  pollJoiningZkeyPath?: string;
  /**
   * The path to the poll joined zkey
   */
  pollJoinedZkeyPath?: string;
  /**
   * The path to the process messages zkey
   */
  processMessagesZkeyPath?: string;
  /**
   * The path to the tally votes zkey
   */
  tallyVotesZkeyPath?: string;
}

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
 * An interface that represents arguments of generation sign up tree and state leaves
 */
export interface IGenSignUpTreeArgs {
  /**
   * The etherum provider
   */
  provider: Provider;

  /**
   * The address of MACI contract
   */
  address: string;

  /**
   * The block number from which to start fetching events
   */
  fromBlock?: number;

  /**
   * The number of blocks to fetch in each request
   */
  blocksPerRequest?: number;

  /**
   * The block number at which to stop fetching events
   */
  endBlock?: number;

  /**
   * The amount of time to sleep between each request
   */
  sleepAmount?: number;
}

/**
 * An interface that represents sign up tree and state leaves
 */
export interface IGenSignUpTree {
  /**
   * Sign up tree
   */
  signUpTree: LeanIMT;

  /**
   * State leaves
   */
  pubKeys: PubKey[];
}

/**
 * Interface for the arguments for the generateVote function
 */
export interface IGenerateVoteArgs {
  /**
   * The poll id
   */
  pollId: bigint;
  /**
   * The index of the vote option
   */
  voteOptionIndex: bigint;
  /**
   * The salt for the vote
   */
  salt?: bigint;
  /**
   * The nonce for the vote
   */
  nonce: bigint;
  /**
   * The private key for the vote
   */
  privateKey: PrivKey;
  /**
   * The state index for the vote
   */
  stateIndex: bigint;
  /**
   * The weight of the vote
   */
  voteWeight: bigint;
  /**
   * The coordinator public key
   */
  coordinatorPubKey: PubKey;
  /**
   * The largest vote option index
   */
  maxVoteOption: bigint;
  /**
   * Ephemeral keypair
   */
  ephemeralKeypair?: Keypair;
  /**
   * New key in case of key change message
   */
  newPubKey?: PubKey;
}

/**
 * Interface for the vote object
 */
export interface IVote {
  /**
   * The message to be sent to the contract
   */
  message: Message;
  /**
   * The ephemeral keypair used to generate the shared key for encrypting the message
   */
  ephemeralKeypair: Keypair;
}
