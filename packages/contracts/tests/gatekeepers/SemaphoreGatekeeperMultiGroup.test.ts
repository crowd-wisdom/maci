import { expect } from "chai";
import { AbiCoder, Signer, ZeroAddress } from "ethers";
import { Keypair } from "maci-domainobjs";

import { deploySemaphoreGatekeeperMultiGroup, deployContract } from "../../ts/deploy";
import { getDefaultSigner, getSigners } from "../../ts/utils";
import { MACI, SemaphoreGatekeeperMultiGroup, MockSemaphoreMultiGroup } from "../../typechain-types";
import { STATE_TREE_DEPTH, initialVoiceCreditBalance } from "../constants";
import { deployTestContracts } from "../utils";

describe("SemaphoreMultiGroup Gatekeeper", () => {
  let semaphoreGatekeeperMultiGroup: SemaphoreGatekeeperMultiGroup;
  let mockSemaphoreMultiGroup: MockSemaphoreMultiGroup;
  let signer: Signer;
  let signerAddress: string;

  const user = new Keypair();

  const curatorsGroupId = 0n;
  const validatorsGroupId = 1n;
  const invalidGroupId = 2n;

  const proof = {
    merkleTreeDepth: 1n,
    merkleTreeRoot: 0n,
    nullifier: 0n,
    message: 0n,
    scope: curatorsGroupId,
    points: [0n, 0n, 0n, 0n, 0n, 0n, 0n, 0n],
  };

  const proofCurators = {
    merkleTreeDepth: 1n,
    merkleTreeRoot: 0n,
    nullifier: 0n,
    message: curatorsGroupId,
    scope: 0n,
    points: [0n, 0n, 0n, 0n, 0n, 0n, 0n, 0n],
  };

  const proofValidators = {
    merkleTreeDepth: 1n,
    merkleTreeRoot: 0n,
    nullifier: 1n,
    message: validatorsGroupId,
    scope: 1n,
    points: [0n, 0n, 0n, 0n, 0n, 0n, 0n, 0n],
  };

  const invalidProof = {
    merkleTreeDepth: 1n,
    merkleTreeRoot: 0n,
    nullifier: 0n,
    message: invalidGroupId,
    scope: 2n,
    points: [1n, 0n, 0n, 0n, 0n, 0n, 0n, 0n],
  };

  const encodedProofCurators = AbiCoder.defaultAbiCoder().encode(
    ["uint256", "uint256", "uint256", "uint256", "uint256", "uint256[8]"],
    [
      proofCurators.merkleTreeDepth,
      proofCurators.merkleTreeRoot,
      proofCurators.nullifier,
      proofCurators.message,
      proofCurators.scope,
      proofCurators.points,
    ],
  );

  const encodedProofValidators = AbiCoder.defaultAbiCoder().encode(
    ["uint256", "uint256", "uint256", "uint256", "uint256", "uint256[8]"],
    [
      proofValidators.merkleTreeDepth,
      proofValidators.merkleTreeRoot,
      proofValidators.nullifier,
      proofValidators.message,
      proofValidators.scope,
      proofValidators.points,
    ],
  );
  const encodedProofInvalidGroupId = AbiCoder.defaultAbiCoder().encode(
    ["uint256", "uint256", "uint256", "uint256", "uint256", "uint256[8]"],
    [proof.merkleTreeDepth, proof.merkleTreeRoot, proof.nullifier, invalidGroupId, proof.scope, proof.points],
  );

  const encodedInvalidProof = AbiCoder.defaultAbiCoder().encode(
    ["uint256", "uint256", "uint256", "uint256", "uint256", "uint256[8]"],
    [
      invalidProof.merkleTreeDepth,
      invalidProof.merkleTreeRoot,
      invalidProof.nullifier,
      curatorsGroupId,
      invalidProof.scope,
      invalidProof.points,
    ],
  );

  before(async () => {
    signer = await getDefaultSigner();
    mockSemaphoreMultiGroup = await deployContract("MockSemaphoreMultiGroup", signer, true, curatorsGroupId);
    const mockSemaphoreAddress = await mockSemaphoreMultiGroup.getAddress();
    await mockSemaphoreMultiGroup.setSemaphoreGroups(validatorsGroupId);
    signerAddress = await signer.getAddress();
    semaphoreGatekeeperMultiGroup = await deploySemaphoreGatekeeperMultiGroup(mockSemaphoreAddress, signer, true);
    await semaphoreGatekeeperMultiGroup.setSemaphoreGroups(validatorsGroupId);
  });

  describe("Deployment", () => {
    it("The gatekeeper should be deployed correctly", () => {
      expect(semaphoreGatekeeperMultiGroup).to.not.eq(undefined);
    });
  });

  describe("Gatekeeper", () => {
    let maciContract: MACI;

    before(async () => {
      const r = await deployTestContracts({
        initialVoiceCreditBalance,
        stateTreeDepth: STATE_TREE_DEPTH,
        signer,
        gatekeeper: semaphoreGatekeeperMultiGroup,
      });

      maciContract = r.maciContract;
    });

    it("sets MACI instance correctly", async () => {
      const maciAddress = await maciContract.getAddress();
      await semaphoreGatekeeperMultiGroup.setMaciInstance(maciAddress).then((tx) => tx.wait());

      expect(await semaphoreGatekeeperMultiGroup.maci()).to.eq(maciAddress);
    });

    it("should fail to set MACI instance when the caller is not the owner", async () => {
      const [, secondSigner] = await getSigners();
      await expect(
        semaphoreGatekeeperMultiGroup.connect(secondSigner).setMaciInstance(signerAddress),
      ).to.be.revertedWithCustomError(semaphoreGatekeeperMultiGroup, "OwnableUnauthorizedAccount");
    });

    it("should fail to set MACI instance when the MACI instance is not valid", async () => {
      await expect(semaphoreGatekeeperMultiGroup.setMaciInstance(ZeroAddress)).to.be.revertedWithCustomError(
        semaphoreGatekeeperMultiGroup,
        "ZeroAddress",
      );
    });

    it("should not register a user if the register function is called with invalid groupId", async () => {
      await semaphoreGatekeeperMultiGroup.setMaciInstance(await maciContract.getAddress()).then((tx) => tx.wait());

      await expect(
        maciContract.signUp(
          user.pubKey.asContractParam(),
          encodedProofInvalidGroupId,
          AbiCoder.defaultAbiCoder().encode(["uint256"], [1]),
        ),
      ).to.be.revertedWithCustomError(semaphoreGatekeeperMultiGroup, "InvalidGroup");
    });

    it("should revert if the proof is invalid (mock)", async () => {
      await mockSemaphoreMultiGroup.flipValid();
      await expect(
        maciContract.signUp(
          user.pubKey.asContractParam(),
          encodedInvalidProof,
          AbiCoder.defaultAbiCoder().encode(["uint256"], [1]),
        ),
      ).to.be.revertedWithCustomError(semaphoreGatekeeperMultiGroup, "InvalidProof");
      await mockSemaphoreMultiGroup.flipValid();
    });

    it("should register a user curator if the register function is called with the valid data", async () => {
      const tx = await maciContract.signUp(
        user.pubKey.asContractParam(),
        encodedProofCurators,
        AbiCoder.defaultAbiCoder().encode(["uint256"], [1]),
      );

      const receipt = await tx.wait();

      expect(receipt?.status).to.eq(1);
    });

    it("should register a user validator if the register function is called with the valid data", async () => {
      const tx = await maciContract.signUp(
        user.pubKey.asContractParam(),
        encodedProofValidators,
        AbiCoder.defaultAbiCoder().encode(["uint256"], [1]),
      );

      const receipt = await tx.wait();

      expect(receipt?.status).to.eq(1);
    });

    it("Add new group,generate proof and validate", async () => {
      const [, secondSigner] = await getSigners();

      const user2 = new Keypair();

      const newGroupId = 2;
      const newNullifier = 2;

      let tx = await mockSemaphoreMultiGroup.connect(secondSigner).setSemaphoreGroups(newGroupId);
      let receipt = await tx.wait();
      expect(receipt?.status).to.eq(1);

      tx = await semaphoreGatekeeperMultiGroup.setSemaphoreGroups(newGroupId);
      receipt = await tx.wait();
      expect(receipt?.status).to.eq(1);

      const encodedProof = AbiCoder.defaultAbiCoder().encode(
        ["uint256", "uint256", "uint256", "uint256", "uint256", "uint256[8]"],
        [proof.merkleTreeDepth, proof.merkleTreeRoot, newNullifier, newGroupId, proof.scope, proof.points],
      );

      tx = await maciContract.signUp(
        user2.pubKey.asContractParam(),
        encodedProof,
        AbiCoder.defaultAbiCoder().encode(["uint256"], [1]),
      );

      receipt = await tx.wait();

      expect(receipt?.status).to.eq(1);
    });

    it("should prevent signing up twice", async () => {
      await expect(
        maciContract.signUp(
          user.pubKey.asContractParam(),
          encodedProofCurators,
          AbiCoder.defaultAbiCoder().encode(["uint256"], [1]),
        ),
      ).to.be.revertedWithCustomError(semaphoreGatekeeperMultiGroup, "AlreadyRegistered");
    });

    it("should fail to set a new group when the caller is not the owner", async () => {
      const [, secondSigner] = await getSigners();
      await expect(
        semaphoreGatekeeperMultiGroup.connect(secondSigner).setSemaphoreGroups(2),
      ).to.be.revertedWithCustomError(semaphoreGatekeeperMultiGroup, "OwnableUnauthorizedAccount");
    });
  });
});
