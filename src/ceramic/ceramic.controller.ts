import { Controller, Get, Query } from "@nestjs/common";
import { CeramicService } from "./ceramic.service";

@Controller('ceramic')
export class CeramicController {
    constructor(private readonly ceramicService: CeramicService) {}

    @Get('write')
    async getTestCeramic() {
        console.log("this is ceramic write")
        this.ceramicService.test()
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