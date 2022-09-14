import { Module } from "@nestjs/common";
import { CeramicController } from "./ceramic.controller";
import { CeramicService } from "./ceramic.service";

@Module({
    controllers: [CeramicController],
    providers: [CeramicService],
})
export class CeramicModule{}