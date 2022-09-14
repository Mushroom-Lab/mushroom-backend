import { Injectable } from "@nestjs/common";
import { CeramicClient } from '@ceramicnetwork/http-client'
import { DataModel } from '@glazed/datamodel'
import { DIDDataStore } from '@glazed/did-datastore'
import { DID } from 'dids'
import { Ed25519Provider } from 'key-did-provider-ed25519'
import { getResolver } from 'key-did-resolver'
import { fromString } from 'uint8arrays'
import modelAliases from './model.json' assert {type: "json"}

@Injectable()
export class CeramicService {

    constructor(
        // private readonly bqCacheService: BqCacheService,
    ){}


    async test() {

        // The key must be provided as an environment variable
        const key = fromString('849f318c3eb64b95fc17c9292d80a1c7d72da433da0ddca7acdda3a3e10d523d', 'base16')
        // Create and authenticate the DID
        const did = new DID({
        provider: new Ed25519Provider(key),
        resolver: getResolver(),
        })
        await did.authenticate()

        // Create the Ceramic instance and inject the DID
        const ceramic = new CeramicClient('http://localhost:7007')
        ceramic.did = did

        // Create the model and store
        const model = new DataModel({ ceramic, aliases: modelAliases })
        const store = new DIDDataStore({ ceramic, model })

        await store.set('myNote', { text: 'This is my note 333' })
        const result = await store.get('myNote')
        console.log(result)
        console.log(store)
    }

//     async getHoldersProjectDistribution(contract: string): Promise<string> {
//         const sql = `with bayc_holders as (
//             select address, contract, balance
//             from sound-district-357507.intermediate_data.nft_balances_all
//             where contract = "${contract}"
//           ),
//           other_collections as (
//             select nba.contract, count(1) as cnt
//             from sound-district-357507.intermediate_data.nft_balances_all as nba
//             inner join bayc_holders as bh
//             on nba.address = bh.address
//             where nba.contract != "${contract}"
//             group by nba.contract
//           ),
//           bayc_holder_num as (
//             select count(1) as bayc_holder_num
//             from bayc_holders
//           )
          
//           select
//             oc.contract,
//             oc.cnt,
//             bhn.bayc_holder_num,
//             oc.cnt/bhn.bayc_holder_num as ratio,
//             c.name,
//             c.image
//           from other_collections as oc
//           inner join sound-district-357507.nft.collections as c
//           on oc.contract = c.id
//           cross join bayc_holder_num as bhn
//           order by oc.cnt desc`;

//         return this.bqCacheService.getDataBySql(sql)
//     }

//     async getPoapByKeywords(keyword: string): Promise<string> {
//       const sql = `SELECT name, description, event_id FROM sound-district-357507.poap.metadata
//       where lower(name) like "%${keyword}%"
//       or lower(description) like "%${keyword}%"
//       order by start_date desc`;

//       return this.bqCacheService.getDataBySql(sql)
//   }
//   }

//   async getPoapBayc(): Promise<string> {
//     const sql = `SELECT * FROM sound-district-357507.intermediate_data.poap_bayc`;

//     return this.bqCacheService.getDataBySql(sql)
// }


}