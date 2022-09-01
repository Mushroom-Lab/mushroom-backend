import { Module } from '@nestjs/common'
import { BqCacheService} from './bqcache.service'
import { BqCacheController } from './bqcache.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BqCache } from './bqcache.entity'

@Module({
    imports: [TypeOrmModule.forFeature([BqCache])],
    controllers: [BqCacheController],
    providers: [BqCacheService],
    exports: [BqCacheService],
})
export class BqCacheModule {}