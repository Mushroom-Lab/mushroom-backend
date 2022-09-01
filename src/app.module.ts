import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BqCache } from './bqcache/bqcache.entity';
import { BqCacheModule } from './bqcache/bqcache.module';
import { DataModule } from './data/data.module';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'password',
    database: 'test',
    entities: [BqCache],
    synchronize: true,
  }), DataModule],
  // controllers: [],
  // providers: [],
})
export class AppModule {}
