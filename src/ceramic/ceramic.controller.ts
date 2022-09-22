import { Controller, Get, Query, Post, Param, Body } from "@nestjs/common";
import { CeramicService } from "./ceramic.service";

@Controller('ceramic')
export class CeramicController {
    constructor(private readonly ceramicService: CeramicService) {}

    @Get('write')
    async getTestCeramic(
        @Param('name') name: string,
        @Param('address') address: string,
        @Param('date') date: string
    ): Promise<string> {
        console.log("this is ceramic write")
        return this.ceramicService.test(name, address, date)
    }

    @Post('save_session')
    async saveSession(
        @Body('session') session: string,
        @Body('user_id') user_id: number,
        @Body('guild_id') guild_id: number,
        @Body('address') address: string
    ) {
        this.ceramicService.saveUserSession(session, user_id, guild_id, address);
    }

    @Post('write_profile')
    async postProfileToCeramic(
        @Body('guild_id') guild_id: number,
        @Body('user_id') user_id: number,
        @Body('level') level: number
    ): Promise<string> {
        // ["0", streamID.toString()]
        // ["1", "session does not exist"]
        // ["2", "session is expired"]
        return this.ceramicService.saveProfileToCeramic(guild_id, user_id, level);
    }

    @Get('get_profile')
    async getProfileFromCeramic(
        @Body('guild_id') guild_id: number,
        @Body('user_id') user_id: number
    ): Promise<string> {
        return this.ceramicService.getProfileFromCeramic(user_id, guild_id);
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