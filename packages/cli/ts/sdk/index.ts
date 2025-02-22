import { extractVkToFile } from "../commands/extractVkToFile";
import { genKeyPair } from "../commands/genKeyPair";
import { genMaciPubKey } from "../commands/genPubKey";
import { mergeSignups } from "../commands/mergeSignups";
import { getPoll } from "../commands/poll";
import { publish, publishBatch } from "../commands/publish";
import {
  signup,
  isRegisteredUser,
  getGatekeeperTrait,
  getSemaphoreGatekeeperData,
  getZupassGatekeeperData,
  getEASGatekeeperData,
  getHatsSingleGatekeeperData,
  getMerkleProofGatekeeperData,
} from "../commands/signup";
import { verify } from "../commands/verify";

export {
  genKeyPair,
  genMaciPubKey,
  publish,
  publishBatch,
  signup,
  isRegisteredUser,
  verify,
  getPoll,
  extractVkToFile,
  mergeSignups,
  getGatekeeperTrait,
  getSemaphoreGatekeeperData,
  getZupassGatekeeperData,
  getEASGatekeeperData,
  getHatsSingleGatekeeperData,
  getMerkleProofGatekeeperData,
};

export {
  linkPoseidonLibraries,
  Deployment,
  ContractStorage,
  EContracts,
  EMode,
  type IVerifyingKeyStruct,
} from "maci-sdk";

export * from "maci-contracts/typechain-types";

export { VerifyingKey, PubKey, type IVkObjectParams } from "maci-domainobjs";

export { GatekeeperTrait } from "../utils/interfaces";

export type {
  TallyData,
  PublishArgs,
  SignupArgs,
  ISignupData,
  VerifyArgs,
  IGetPollArgs,
  IGetPollData,
  IRegisteredUserArgs,
  IPublishBatchArgs,
  IGenKeypairArgs,
  IPublishBatchData,
  IPublishMessage,
  IGetGatekeeperDataArgs,
  ISemaphoreGatekeeperData,
  IZupassGatekeeperData,
  IHatsGatekeeperData,
  IMerkleProofGatekeeperData,
} from "../utils";
