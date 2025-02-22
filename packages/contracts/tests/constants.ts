import { AddressLike } from "ethers";
import { TreeDepths, STATE_TREE_ARITY } from "maci-core";
import { G1Point, G2Point } from "maci-crypto";
import { VerifyingKey } from "maci-domainobjs";

export interface ExtContractsStruct {
  maci: AddressLike;
  verifier: AddressLike;
  vkRegistry: AddressLike;
  gatekeeper: AddressLike;
  initialVoiceCreditProxy: AddressLike;
}

export const duration = 2_000;

export const STATE_TREE_DEPTH = 10;
export const MESSAGE_TREE_DEPTH = 2;
export const MESSAGE_TREE_SUBDEPTH = 1;
export const messageBatchSize = 20;

export const testPollJoiningVk = new VerifyingKey(
  new G1Point(BigInt(0), BigInt(1)),
  new G2Point([BigInt(2), BigInt(3)], [BigInt(4), BigInt(5)]),
  new G2Point([BigInt(6), BigInt(7)], [BigInt(8), BigInt(9)]),
  new G2Point([BigInt(10), BigInt(11)], [BigInt(12), BigInt(13)]),
  [new G1Point(BigInt(14), BigInt(15)), new G1Point(BigInt(16), BigInt(17))],
);

export const testPollJoinedVk = new VerifyingKey(
  new G1Point(BigInt(0), BigInt(1)),
  new G2Point([BigInt(2), BigInt(3)], [BigInt(4), BigInt(5)]),
  new G2Point([BigInt(6), BigInt(7)], [BigInt(8), BigInt(9)]),
  new G2Point([BigInt(10), BigInt(11)], [BigInt(12), BigInt(13)]),
  [new G1Point(BigInt(14), BigInt(15)), new G1Point(BigInt(16), BigInt(17))],
);

export const testProcessVk = new VerifyingKey(
  new G1Point(BigInt(0), BigInt(1)),
  new G2Point([BigInt(2), BigInt(3)], [BigInt(4), BigInt(5)]),
  new G2Point([BigInt(6), BigInt(7)], [BigInt(8), BigInt(9)]),
  new G2Point([BigInt(10), BigInt(11)], [BigInt(12), BigInt(13)]),
  [new G1Point(BigInt(14), BigInt(15)), new G1Point(BigInt(16), BigInt(17))],
);

export const testTallyVk = new VerifyingKey(
  new G1Point(BigInt(0), BigInt(1)),
  new G2Point([BigInt(2), BigInt(3)], [BigInt(4), BigInt(5)]),
  new G2Point([BigInt(6), BigInt(7)], [BigInt(8), BigInt(9)]),
  new G2Point([BigInt(10), BigInt(11)], [BigInt(12), BigInt(13)]),
  [new G1Point(BigInt(14), BigInt(15)), new G1Point(BigInt(16), BigInt(17))],
);

export const testProcessVkNonQv = new VerifyingKey(
  new G1Point(BigInt(1), BigInt(1)),
  new G2Point([BigInt(2), BigInt(3)], [BigInt(4), BigInt(5)]),
  new G2Point([BigInt(6), BigInt(7)], [BigInt(8), BigInt(9)]),
  new G2Point([BigInt(10), BigInt(11)], [BigInt(12), BigInt(13)]),
  [new G1Point(BigInt(14), BigInt(15)), new G1Point(BigInt(16), BigInt(17))],
);

export const testTallyVkNonQv = new VerifyingKey(
  new G1Point(BigInt(1), BigInt(1)),
  new G2Point([BigInt(2), BigInt(3)], [BigInt(4), BigInt(5)]),
  new G2Point([BigInt(6), BigInt(7)], [BigInt(8), BigInt(9)]),
  new G2Point([BigInt(10), BigInt(11)], [BigInt(12), BigInt(13)]),
  [new G1Point(BigInt(14), BigInt(15)), new G1Point(BigInt(16), BigInt(17))],
);

export const initialVoiceCreditBalance = 100;
export const maxVoteOptions = 25;

export const treeDepths: TreeDepths = {
  intStateTreeDepth: 1,
  voteOptionTreeDepth: 2,
};

export const tallyBatchSize = STATE_TREE_ARITY ** treeDepths.intStateTreeDepth;
