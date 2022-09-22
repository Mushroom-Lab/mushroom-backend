import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MoreThan, Repository } from "typeorm";
import { BqCache } from "./bqcache.entity";
import * as shajs from 'sha.js';
import { BigQuery } from '@google-cloud/bigquery';


@Injectable()
export class BqCacheService {
    private bigquery = new BigQuery();
    
    constructor(
        @InjectRepository(BqCache)
        private bqCacheRepository: Repository<BqCache>,
    ){}

    async executeBigQuery(query: string): Promise<string> {
        const options = {
            query: query,
            location: 'us-central1',
        };
        const [job] = await this.bigquery.createQueryJob(options);
        const [rows] = await job.getQueryResults();        
        return JSON.stringify(rows);
      }


    async findCacheByHash(hash: string): Promise<BqCache> {
        const validTime = new Date(Date.now() - 300000000); // 5000min
        const [bqCache] = await this.bqCacheRepository.find({
            where: {
                hash: hash,
                updatedAt: MoreThan(validTime),
            }
        });
        return bqCache;
    }

    async upsertCache(sql: string, result: string) {        
        const bqCache = this.bqCacheRepository.create({
            hash: new shajs.sha256().update(sql).digest('hex').toString(),
            sql: sql,
            result: result,
            updatedAt: new Date(),
        });
        await this.bqCacheRepository.save(bqCache);
    }

    async getDataBySql(sql: string): Promise<string> {
        const hash = new shajs.sha256().update(sql).digest('hex').toString();
        const bqCache = await this.findCacheByHash(hash);
        if (bqCache !== undefined) {
            return bqCache.result;
        }
        const bqResultStr = await this.executeBigQuery(sql);
        await this.upsertCache(sql, bqResultStr);
        return bqResultStr;
    }


    // testSql(sql: string) {
    //     // const hash = shajs('sha256').update(sql).digest('hex').toString();
    //     // const bqCache = await this.findByHash(hash);
    //     // if (bqCache === undefined) {
    //     //     console.log("this is undefined")
    //     // }
    //     // console.log(bqCache);
    //     return sql;
    // }

}