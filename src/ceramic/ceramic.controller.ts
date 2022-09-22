import { Controller, Get, Query, Post } from "@nestjs/common";
import { CeramicService } from "./ceramic.service";

@Controller('ceramic')
export class CeramicController {
    constructor(private readonly ceramicService: CeramicService) {}

    @Get('write')
    async getTestCeramic(
        @Query('name') name: string,
        @Query('address') address: string,
        @Query('date') date: string
    ): Promise<string> {
        console.log("this is ceramic write")
        return this.ceramicService.test(name, address, date)
    }

    @Post('save_session')
    async saveSession(
        @Query('session') session: string,
        @Query('user_id') user_id: number,
        @Query('guild_id') guild_id: number,
        @Query('address') address: string
    ) {
        this.ceramicService.saveDIDSession(session, user_id, guild_id, address)
    }



    @Post('write_profile')
    async postProfileToCeramic(
    ): Promise<string> {
        console.log("this is ceramic write_profile");
        return "k2t6wyfsu4pg01w0xdl8xl7wkt62fudnhg9axfiqdsolbblvy7bubp2qmnn2je";
    }


    // @Get('holders_project_distribution')
    // async getHoldersProjectDistribution(@Query('contract') contract: string): Promise<string> {
    //     return this.dataService.getHoldersProjectDistribution(contract)
    // }

    // @Get('search_poap')
    // async getPoapByKeywords(@Query('keyword') keyword: string): Promise<string> {
    //     return this.dataService.getPoapByKeywords(keyword)
    // }

}