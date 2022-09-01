import { Module } from "@nestjs/common";
import { BqCacheModule } from "../bqcache/bqcache.module";
import { DataController } from "./data.controller";
import { DataService } from "./data.service";

@Module({
    imports: [BqCacheModule],
    controllers: [DataController],
    providers: [DataService],
})
export class DataModule{}