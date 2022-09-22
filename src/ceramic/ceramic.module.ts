import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CeramicController } from "./ceramic.controller";
import { UserSession } from "./ceramic.entity";
import { CeramicService } from "./ceramic.service";

@Module({
    imports: [TypeOrmModule.forFeature([UserSession])],
    controllers: [CeramicController],
    providers: [CeramicService],
})
export class CeramicModule{}