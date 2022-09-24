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

    async postDMToUser(content: string, userId: string) {
        const data = { content }
        const response = await fetch(
          `https://connect.mushroom.social:3334/dm/${userId}`,
          {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        
        return response.status
    }
      

    // session <-> db
    // id number, user_id number, guild_id number, session string, address string
    async saveUserSession(session: string, user_id: string, guild_id: string, address: string) {        
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

    async saveProfileToCeramic(userId: string, guildId: string, level: string, popularityLevel: string) {

        console.log("saveProfileToCeramic", userId, guildId, level, popularityLevel)
        if (userId === undefined || guildId === undefined || level === undefined || popularityLevel === undefined) {
            return JSON.stringify({"status": 1});
        }

        const entry = await this.userSessionRepository.findOne({ 
            where: { userId, guildId }
        });

        if (!entry) {
            return JSON.stringify({"status": 1});
        }
        
        const session = await DIDSession.fromSession(entry.session)
        if (session.isExpired) {
            return JSON.stringify({"status": 2});
        }
        this.ceramic.did = session.did
        
        const model = new DataModel({ ceramic: this.ceramic, aliases: modelAliases })
        const store = new DIDDataStore({ ceramic: this.ceramic, model })
        const address = session.did.parent
        
        const stream = await store.get('mushroomCards')
        const cards = stream ? stream["cards"] : [] // if stream is null, set to []
        const card = cards.find((card) => {
            return card["profile"]["guildId"] === guildId && card["profile"]["userId"] === userId;
        });

        const updateTime = String(Date.now());
        var content = card

        if (!card) {
            const newCard = {}
            newCard["profile"] = {
                guildId, userId, level, popularityLevel, address, updatedAt: updateTime
            }
            newCard["signature"] = await this.signMessage(JSON.stringify(newCard["profile"]))
            newCard["signerAddr"] = this.signer.address
            cards.push(newCard)
            content = newCard

        } else {
            card["profile"] = {
                guildId, userId, level, popularityLevel, address, updatedAt: updateTime
            }
            card["signature"] = await this.signMessage(JSON.stringify(card["profile"]))
            card["signerAddr"] = this.signer.address
        }
        const streamID = await store.set('mushroomCards', { cards })

        // notify user using dm
        const dmContent = `You have already linked Discord with your wallet. Check your onchain profile: https://cerscan.com/testnet-clay/stream/${streamID.toString()}`
        await this.postDMToUser(dmContent, userId)


        return JSON.stringify({"status": 0, "stream_id": streamID.toString(), "content": content})
    }

    async getProfileFromCeramic(userId: string, guildId: string) {

        console.log("getProfileFromCeramic", userId, guildId)
        const entry = await this.userSessionRepository.findOne({ 
            where: { userId, guildId }
        });

        if (!entry) {
            return JSON.stringify({"status": 1});
        }

        const session = await DIDSession.fromSession(entry.session)
        const model = new DataModel({ ceramic: this.ceramic, aliases: modelAliases })
        const store = new DIDDataStore({ ceramic: this.ceramic, model })
        const did = session.did.parent

        const stream = await store.get('mushroomCards', did)
        const cards = stream ? stream["cards"] : [] // if stream is null, set to []

        const card = cards.find((card) => {
            return card["profile"]["guildId"] === guildId && card["profile"]["userId"] === userId;
        });

        if (!card) {
            return JSON.stringify({"status": 1});
        } else {
            return JSON.stringify ({
                "status": 0,
                "profile": card["profile"]
            })
        }
    }

}