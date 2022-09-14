import { Module } from '@nestjs/common'
import { BqCacheService} from './bqcache.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BqCache } from './bqcache.entity'

@Module({
    imports: [TypeOrmModule.forFeature([BqCache])],
    providers: [BqCacheService],
    exports: [BqCacheService],
})
export class BqCacheModule {}