import { Controller, Get, Query, Post, Param, Body, ParseIntPipe, Res, HttpStatus, BadRequestException } from "@nestjs/common";
import { isNotEmpty } from 'class-validator';
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
        @Body('user_id') user_id: string,
        @Body('guild_id') guild_id: string,
        @Body('address') address: string,
    ) {
        if (isNotEmpty(session) || isNotEmpty(user_id) || isNotEmpty(guild_id) || isNotEmpty(address)) {
            throw new BadRequestException("string is empty");
        }
        this.ceramicService.saveUserSession(session, user_id, guild_id, address);
    }

    @Post('write_profile')
    async postProfileToCeramic(
        @Body('guild_id') guild_id: string,
        @Body('user_id') user_id: string,
        @Body('level') level: string
    ): Promise<string> {
        // ["0", streamID.toString()]
        // ["1", "session does not exist"]
        // ["2", "session is expired"]
        if (isNotEmpty(user_id) || isNotEmpty(guild_id)) {
            throw new BadRequestException("string is empty");
        }
        return this.ceramicService.saveProfileToCeramic(guild_id, user_id, level);
    }

    @Get('get_profile')
    async getProfileFromCeramic(
        @Query('guild_id') guild_id: string,
        @Query('user_id') user_id: string
    ): Promise<string> {
        // ["0", profile]
        // ["1", "user+guild not exist"]
        if (isNotEmpty(user_id) || isNotEmpty(guild_id)) {
            throw new BadRequestException("string is empty");
        }
        return this.ceramicService.getProfileFromCeramic(user_id, guild_id);
    }

}