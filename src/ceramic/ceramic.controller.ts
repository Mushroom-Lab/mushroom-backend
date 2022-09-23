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
        if (isNotEmpty(session) && isNotEmpty(user_id) && isNotEmpty(guild_id) && isNotEmpty(address)) {
            console.log("saveSession", session, user_id, guild_id, address)
            this.ceramicService.saveUserSession(session, user_id, guild_id, address);
        } else {
            throw new BadRequestException("Validation failed(string is empty)");
        }
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
        if (isNotEmpty(user_id) && isNotEmpty(guild_id)) {
            return this.ceramicService.saveProfileToCeramic(guild_id, user_id, level);
        } else {
            throw new BadRequestException("Validation failed(string is empty)");
        }
        
    }

    @Get('get_profile')
    async getProfileFromCeramic(
        @Query('guild_id') guild_id: string,
        @Query('user_id') user_id: string
    ): Promise<string> {
        // ["0", profile]
        // ["1", "user+guild not exist"]
        if (isNotEmpty(user_id) && isNotEmpty(guild_id)) {
            return this.ceramicService.getProfileFromCeramic(user_id, guild_id);
        } else {
            throw new BadRequestException("Validation failed(string is empty)");
        }
        
    }

}