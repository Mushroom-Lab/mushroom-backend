import { Injectable } from "@nestjs/common";
import { CeramicClient } from '@ceramicnetwork/http-client'
import { DataModel } from '@glazed/datamodel'
import { DIDDataStore } from '@glazed/did-datastore'
import { DID } from 'dids'
import { Ed25519Provider } from 'key-did-provider-ed25519'
import { getResolver } from 'key-did-resolver'
import { fromString } from 'uint8arrays'
import { UserSession  } from "./ceramic.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as shajs from 'sha.js';
import { DIDSession } from "did-session";
import { Wallet, utils } from 'ethers'

import modelAliases from './model.json' assert {type: "json"}

@Injectable()
export class CeramicService {

    private ceramic = new CeramicClient('https://ceramic.staging.dpopp.gitcoin.co/')
    private signer = Wallet.fromMnemonic(process.env.MNEMONIC)

    constructor(
        @InjectRepository(UserSession)
        private userSessionRepository: Repository<UserSession>,
    ){}

    async test(name: string, address: string, date: string): Promise<string> {
        // The key must be provided as an environment variable
        const key = fromString('849f318c3eb64b95fc17c9292d80a1c7d72da433da0ddca7acdda3a3e10d523d', 'base16')
        // Create and authenticate the DID
        const did = new DID({
            provider: new Ed25519Provider(key),
            resolver: getResolver(),
        })
        await did.authenticate()

        // Create the Ceramic instance and inject the DID
        // const ceramic = new CeramicClient('http://localhost:7007')
        const ceramic = new CeramicClient('https://ceramic.staging.dpopp.gitcoin.co/')
        ceramic.did = did

        // Create the model and store
        const model = new DataModel({ ceramic, aliases: modelAliases })
        const store = new DIDDataStore({ ceramic, model })

        const streamid = await store.set('myNote', { text: `name: ${name}, address: ${address}, date: ${date}` })
        const result = await store.get('myNote')
        console.log(result)
        console.log(streamid.toString())
        return streamid.toUrl()
    }

    // session <-> db
    // id number, user_id number, guild_id number, session string, address string
    async saveUserSession(session: string, user_id: number, guild_id: number, address: string) {        
        const hash = new shajs.sha256().update(`${user_id}_${guild_id}`).digest('hex').toString();
        
        const entry = this.userSessionRepository.create({
            hash: hash, session: session, userId: user_id, guildId: guild_id, address: address,
        });
        
        await this.userSessionRepository.save(entry); // save = insert or update
    }

    async signMessage(msg: string): Promise<string> {
        const signature = await this.signer.signMessage(msg)
        return signature
    }

    async saveProfileToCeramic(userId: number, guildId: number, level: number) {
        const entry = await this.userSessionRepository.findOne({ 
            where: { userId, guildId }
        });

        if (!entry) {
            return JSON.stringify({"status": "1"});
        }
        
        const session = await DIDSession.fromSession(entry.session)
        if (session.isExpired) {
            return JSON.stringify({"status": "2"});
        }
        this.ceramic.did = session.did
        
        const model = new DataModel({ ceramic: this.ceramic, aliases: modelAliases })
        const store = new DIDDataStore({ ceramic: this.ceramic, model })
        const address = session.did.parent
        console.log("streamId0")
        
        const stream = await store.get('mushroomCards')
        console.log("stream", stream)
        const cards = stream["cards"]
        console.log("cards", cards)
        const card = cards.find((card) => {
            return card["profile"]["guildId"] === guildId && card["profile"]["userId"] === userId;
        });
        console.log("card", card)

        const updateTime = String(Date.now());

        if (!card) {

            console.log("card1")
            const newCard = {}
            newCard["profile"] = {
                guildId, userId, level, address, updatedAt: updateTime
            }
            newCard["signature"] = this.signMessage(JSON.stringify(newCard["profile"]))
            newCard["signerAddr"] = this.signer.address
            cards.push(newCard)
            console.log("cards1", cards)

        } else {
            card["profile"] = {
                guildId, userId, level, address, updatedAt: updateTime
            }
            card["signature"] = this.signMessage(JSON.stringify(card["profile"]))
            card["signerAddr"] = this.signer.address
            console.log("card2", card)
        }
        console.log("card3", cards)
        const streamID = await store.set('mushroomCards', { cards })
        console.log("card4", cards)
        return JSON.stringify({"status": "0", "stream_id": streamID.toString()})
    }

}