import { MACI__factory as MACIFactory, Poll__factory as PollFactory } from "maci-contracts/typechain-types";
import { genRandomSalt } from "maci-crypto";
import {
  type IG1ContractParams,
  type IMessageContractParams,
  Keypair,
  PCommand,
  PrivKey,
  PubKey,
} from "maci-domainobjs";
import { generateVote, getCoordinatorPubKey } from "maci-sdk";

import type { IPublishBatchArgs, IPublishBatchData, PublishArgs } from "../utils/interfaces";

import { banner } from "../utils/banner";
import { contractExists } from "../utils/contracts";
import { validateSalt } from "../utils/salt";
import { info, logError, logGreen, logYellow } from "../utils/theme";

/**
 * Publish a new message to a MACI Poll contract
 * @param PublishArgs - The arguments for the publish command
 * @returns The ephemeral private key used to encrypt the message
 */
export const publish = async ({
  pubkey,
  stateIndex,
  voteOptionIndex,
  nonce,
  pollId,
  newVoteWeight,
  maciAddress,
  salt,
  privateKey,
  signer,
  quiet = true,
}: PublishArgs): Promise<string> => {
  banner(quiet);

  // validate that the pub key of the user is valid
  if (!PubKey.isValidSerializedPubKey(pubkey)) {
    logError("invalid MACI public key");
  }
  // deserialize
  const votePubKey = PubKey.deserialize(pubkey);

  if (!(await contractExists(signer.provider!, maciAddress))) {
    logError("MACI contract does not exist");
  }

  if (!PrivKey.isValidSerializedPrivKey(privateKey)) {
    logError("Invalid MACI private key");
  }

  const privKey = PrivKey.deserialize(privateKey);

  const maciContract = MACIFactory.connect(maciAddress, signer);
  const pollContracts = await maciContract.getPoll(pollId);

  if (!(await contractExists(signer.provider!, pollContracts.poll))) {
    logError("Poll contract does not exist");
  }

  const pollContract = PollFactory.connect(pollContracts.poll, signer);

  const coordinatorPubKey = await getCoordinatorPubKey(pollContracts.poll, signer);
  const maxVoteOptions = await pollContract.maxVoteOptions();

  const { message, ephemeralKeypair } = generateVote({
    pollId,
    voteOptionIndex,
    salt,
    nonce,
    privateKey: privKey,
    stateIndex,
    voteWeight: newVoteWeight,
    coordinatorPubKey,
    maxVoteOption: maxVoteOptions,
    newPubKey: votePubKey,
  });

  try {
    // submit the message onchain as well as the encryption public key
    const tx = await pollContract.publishMessage(message.asContractParam(), ephemeralKeypair.pubKey.asContractParam());
    const receipt = await tx.wait();

    if (receipt?.status !== 1) {
      logError("Transaction failed");
    }

    logYellow(quiet, info(`Transaction hash: ${receipt!.hash}`));
    logGreen(quiet, info(`Ephemeral private key: ${ephemeralKeypair.privKey.serialize()}`));
  } catch (error) {
    logError((error as Error).message);
  }

  // we want the user to have the ephemeral private key
  return ephemeralKeypair.privKey.serialize();
};

/**
 * Batch publish new messages to a MACI Poll contract
 * @param {IPublishBatchArgs} args - The arguments for the publish command
 * @returns {IPublishBatchData} The ephemeral private key used to encrypt the message, transaction hash
 */
export const publishBatch = async ({
  messages,
  pollId,
  maciAddress,
  publicKey,
  privateKey,
  signer,
  quiet = true,
}: IPublishBatchArgs): Promise<IPublishBatchData> => {
  banner(quiet);

  if (!PubKey.isValidSerializedPubKey(publicKey)) {
    throw new Error("invalid MACI public key");
  }

  if (!PrivKey.isValidSerializedPrivKey(privateKey)) {
    throw new Error("invalid MACI private key");
  }

  if (pollId < 0n) {
    throw new Error(`invalid poll id ${pollId}`);
  }

  const userMaciPubKey = PubKey.deserialize(publicKey);
  const userMaciPrivKey = PrivKey.deserialize(privateKey);
  const maciContract = MACIFactory.connect(maciAddress, signer);
  const pollContracts = await maciContract.getPoll(pollId);

  const pollContract = PollFactory.connect(pollContracts.poll, signer);

  const [maxVoteOptions, coordinatorPubKeyResult] = await Promise.all([
    pollContract.maxVoteOptions().then(Number),
    pollContract.coordinatorPubKey(),
  ]);

  // validate the vote options index against the max leaf index on-chain
  messages.forEach(({ stateIndex, voteOptionIndex, salt, nonce }) => {
    if (voteOptionIndex < 0 || maxVoteOptions < voteOptionIndex) {
      throw new Error("invalid vote option index");
    }

    // check < 1 cause index zero is a blank state leaf
    if (stateIndex < 1) {
      throw new Error("invalid state index");
    }

    if (nonce < 0) {
      throw new Error("invalid nonce");
    }

    if (salt && !validateSalt(salt)) {
      throw new Error("invalid salt");
    }
  });

  const coordinatorPubKey = new PubKey([
    BigInt(coordinatorPubKeyResult.x.toString()),
    BigInt(coordinatorPubKeyResult.y.toString()),
  ]);

  const encryptionKeypair = new Keypair();
  const sharedKey = Keypair.genEcdhSharedKey(encryptionKeypair.privKey, coordinatorPubKey);

  const payload: [IMessageContractParams, IG1ContractParams][] = messages.map(
    ({ salt, stateIndex, voteOptionIndex, newVoteWeight, nonce }) => {
      const userSalt = salt ? BigInt(salt) : genRandomSalt();

      // create the command object
      const command = new PCommand(
        stateIndex,
        userMaciPubKey,
        voteOptionIndex,
        newVoteWeight,
        nonce,
        BigInt(pollId),
        userSalt,
      );

      // sign the command with the user private key
      const signature = command.sign(userMaciPrivKey);

      const message = command.encrypt(signature, sharedKey);

      return [message.asContractParam(), encryptionKeypair.pubKey.asContractParam()];
    },
  );

  const preparedMessages = payload.map(([message]) => message);
  const preparedKeys = payload.map(([, key]) => key);

  const receipt = await pollContract
    .publishMessageBatch(preparedMessages.reverse(), preparedKeys.reverse())
    .then((tx) => tx.wait());

  return {
    hash: receipt?.hash,
    encryptedMessages: preparedMessages,
    privateKey: encryptionKeypair.privKey.serialize(),
  };
};
