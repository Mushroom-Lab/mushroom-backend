import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BqCache } from './bqcache/bqcache.entity';
import { UserSession } from './ceramic/ceramic.entity';
import { CeramicModule } from './ceramic/ceramic.module';
import { DataModule } from './data/data.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'test',
      entities: [BqCache, UserSession],
      synchronize: true,
    }),
    ConfigModule.forRoot(),
    DataModule,
    CeramicModule
  ],
  // controllers: [],
  // providers: [],
})
export class AppModule {}
