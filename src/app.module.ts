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
      host: process.env.PG_HOST,
      port: parseInt(process.env.PG_PORT),
      username: process.env.PG_USERNAME,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
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


console.log("process.env.PG_USERNAMR", process.env.PG_USERNAMR)
console.log("process.env.PG_PASSWORD", process.env.PG_PASSWORD)
console.log("process.env.PG_DATABASE",  process.env.PG_DATABASE)
