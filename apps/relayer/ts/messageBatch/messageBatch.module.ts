import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { IpfsModule } from "../ipfs/ipfs.module";

import { MessageBatchController } from "./messageBatch.controller";
import { MessageBatchRepository } from "./messageBatch.repository";
import { MessageBatch, MessageBatchSchema } from "./messageBatch.schema";
import { MessageBatchService } from "./messageBatch.service";

@Module({
  imports: [MongooseModule.forFeature([{ name: MessageBatch.name, schema: MessageBatchSchema }]), IpfsModule],
  exports: [MessageBatchService],
  controllers: [MessageBatchController],
  providers: [MessageBatchService, MessageBatchRepository],
})
export class MessageBatchModule {}
