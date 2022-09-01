import { Injectable } from "@nestjs/common";
import { BqCacheService } from "../bqcache/bqcache.service";

@Injectable()
export class DataService {

    constructor(
        private readonly bqCacheService: BqCacheService,
    ){}

    async getHoldersProjectDistribution(contract: string): Promise<string> {
        const sql = `with bayc_holders as (
            select address, contract, balance
            from sound-district-357507.intermediate_data.nft_balances_all
            where contract = "${contract}"
          ),
          other_collections as (
            select nba.contract, count(1) as cnt
            from sound-district-357507.intermediate_data.nft_balances_all as nba
            inner join bayc_holders as bh
            on nba.address = bh.address
            where nba.contract != "${contract}"
            group by nba.contract
          ),
          bayc_holder_num as (
            select count(1) as bayc_holder_num
            from bayc_holders
          )
          
          select
            oc.contract,
            oc.cnt,
            bhn.bayc_holder_num,
            oc.cnt/bhn.bayc_holder_num as ratio,
            c.name,
            c.image
          from other_collections as oc
          inner join sound-district-357507.nft.collections as c
          on oc.contract = c.id
          cross join bayc_holder_num as bhn
          order by oc.cnt desc`;

        return this.bqCacheService.getDataBySql(sql)
    }

}