import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { PubKey } from "maci-domainobjs";
import { getDefaultSigner, MACI__factory as MACIFactory, Poll__factory as PollFactory } from "maci-sdk";

import type { PublishMessagesDto } from "./message.dto";

import { MessageBatchService } from "../messageBatch/messageBatch.service";

import { MessageRepository } from "./message.repository";
import { Message } from "./message.schema";

/**
 * MessageService is responsible for saving messages and send them onchain
 */
@Injectable()
export class MessageService {
  /**
   * Logger
   */
  private readonly logger: Logger = new Logger(MessageService.name);

  /**
   * Initialize MessageService
   *
   * @param messageBatchService message batch service
   * @param messageRepository message repository
   */
  constructor(
    private readonly messageBatchService: MessageBatchService,
    private readonly messageRepository: MessageRepository,
  ) {}

  /**
   * Save messages
   *
   * @param args publish messages dto
   * @returns success or not
   */
  async saveMessages(args: PublishMessagesDto): Promise<Message[]> {
    const signer = await getDefaultSigner();

    const maciContract = MACIFactory.connect(args.maciContractAddress, signer);
    const pollAddresses = await maciContract.polls(args.poll);
    const pollContract = PollFactory.connect(pollAddresses.poll, signer);

    const hashes = await Promise.all(
      args.messages.map(({ data, publicKey }) =>
        pollContract.hashMessageAndEncPubKey({ data }, PubKey.deserialize(publicKey).asContractParam()),
      ),
    );

    const messages = args.messages.map((message, index) => ({ ...message, hash: hashes[index].toString() }));

    return this.messageRepository.create({ ...args, messages }).catch((error) => {
      this.logger.error(`Save messages error:`, error);
      throw error;
    });
  }

  /**
   * Publish messages onchain
   *
   * @param args publish messages dto
   * @returns transaction and ipfs hashes
   */
  @Cron(CronExpression.EVERY_HOUR, { name: "publishMessages" })
  async publishMessages(): Promise<boolean> {
    const messages = await this.messageRepository.find({ messageBatch: { $exists: false } });

    if (messages.length === 0) {
      return false;
    }

    await this.messageBatchService.saveMessageBatches([{ messages }]).catch((error) => {
      this.logger.error(`Save message batch error:`, error);
      throw error;
    });

    return true;
  }
}
